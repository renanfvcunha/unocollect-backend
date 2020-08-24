import { Request, Response } from 'express'
import { getRepository, getManager } from 'typeorm'

import { Form } from '../models/Form'
import { Field } from '../models/Field'
import { User } from '../models/User'
import { FormStatus } from '../models/FormStatus'
import Utils from '../utils'

interface FormInterface {
  title: string
  description?: string
  created_at?: Date
  category?: number
}

interface Fields {
  name: string
  description?: string
}

interface FieldsWithId {
  form: number
  name: string
  description?: string
}

class FormController {
  public async index (req: Request, res: Response): Promise<Response> {
    const { per_page, page, search } = req.query

    try {
      let total: number
      const totalCount = await getRepository(Form).count()
      const totalFiltered = await getRepository(Form)
        .createQueryBuilder('form')
        .select()
        .leftJoin('form.category', 'category')
        .orderBy('form.id', 'DESC')
        .where('form.title like :title', { title: '%' + search + '%' })
        .orWhere('category.name like :category', {
          category: '%' + search + '%'
        })
        .getCount()

      let formsQuery = []
      if (search) {
        formsQuery = await getRepository(Form)
          .createQueryBuilder('form')
          .select([
            'form.id as id',
            'form.title as title',
            `form.created_at as created_at`,
            'category.name as category',
            'COUNT(userForm.id) as fills'
          ])
          .leftJoin('form.category', 'category')
          .leftJoin('form.userForm', 'userForm')
          .groupBy('form.id')
          .addGroupBy('category.name')
          .addGroupBy('category.id')
          .orderBy('form.id', 'DESC')
          .where('form.title like :title', { title: '%' + search + '%' })
          .orWhere('category.name like :category', {
            category: '%' + search + '%'
          })
          .limit(Number(per_page))
          .offset((Number(page) - 1) * Number(per_page))
          .getRawMany()

        total = totalFiltered
      } else {
        formsQuery = await getRepository(Form)
          .createQueryBuilder('form')
          .select([
            'form.id as id',
            'form.title as title',
            `form.created_at as created_at`,
            'category.name as category',
            'COUNT(userForm.id) as fills'
          ])
          .leftJoin('form.category', 'category')
          .leftJoin('form.userForm', 'userForm')
          .groupBy('form.id')
          .addGroupBy('category.name')
          .addGroupBy('category.id')
          .orderBy('form.id', 'DESC')
          .limit(Number(per_page))
          .offset((Number(page) - 1) * Number(per_page))
          .getRawMany()

        total = totalCount
      }

      const forms = formsQuery.map((form: FormInterface) => ({
        ...form,
        category: form.category !== null ? form.category : 'Sem Categoria',
        created_at: Utils.utcToLocalTime(form.created_at)
      }))

      return res.json({ forms, total, page: Number(page) })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { title, description, category }: FormInterface = req.body
    const fields: Fields[] = req.body.fields

    // Verificando se já existe formulário com o mesmo título
    const form = await getRepository(Form).find({
      where: { title }
    })
    if (form.length !== 0) {
      return res
        .status(400)
        .json({ msg: 'Já existe um formulário com este título.' })
    }

    try {
      await getManager().transaction(async transactionalEntityManager => {
        // Criando o nome e descrição do formulário
        const result = await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(Form)
          .values([
            {
              category,
              title,
              description
            }
          ])
          .execute()

        // Capturando id inserido no formulário
        const formId: number = result.identifiers[0].id

        // Criando os campos do formulário
        const fieldsWithId = fields.map((field: FieldsWithId) => ({
          form: formId,
          name: field.name,
          description: field.description
        }))

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(Field)
          .values(fieldsWithId)
          .execute()

        // Criando os status do formulario para cada usuário
        const users = await transactionalEntityManager
          .getRepository(User)
          .find({ select: ['id'] })

        const usersId = users.map(user => ({
          form: formId,
          user: user.id
        }))

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(FormStatus)
          .values(usersId)
          .execute()
      })
      return res.json({ msg: 'Formulário criado com sucesso!' })
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'Erro Interno do servidor. Por favor, tente novamente.' })
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      // Buscando formulários com campos e valores
      const formQuery = await getRepository(Form)
        .createQueryBuilder('form')
        .select([
          'form.id',
          'form.title',
          'form.description',
          `form.created_at`,
          'field.id',
          'field.name',
          'field.description',
          `field.created_at`
          /* 'fieldUserValue.value',
          'fieldUserValue.field_id as user_field_id',
          `fieldUserValue.created_at at time zone 'utc' as value_created_at`,
          'userForm.id',
          'user.name' */
        ])
        .leftJoin('form.fields', 'field')
        /* .leftJoin('field.fieldsUserValue', 'fieldUserValue')
        .leftJoin('fieldUserValue.userForm', 'userForm')
        .leftJoin('userForm.user', 'user') */
        .where('form.id = :id', { id })
        .getRawMany()

      // Verificando se houve retorno
      if (formQuery.length === 0) {
        return res
          .status(400)
          .json({ msg: 'Formulário não encontrado na base de dados.' })
      }

      // Atribuindo dados do formulário
      const formId = formQuery[0].form_id
      const formTitle = formQuery[0].form_title
      const formDescription = formQuery[0].form_description
      const formCreatedAt = formQuery[0].form_created_at

      // Atribuindo dados dos valores
      /* const values = formQuery.map(form => ({
        value: form.fieldUserValue_value,
        user: form.user_name,
        field_id: form.user_field_id,
        created_at: form.value_created_at
      })) */

      // Atribuindo dados dos campos do formuçário
      const fields = formQuery.map(form => ({
        id: form.field_id,
        name: form.field_name,
        description: form.field_description,
        created_at: form.field_created_at
      }))

      // Criando array auxiliar e funções para remover campos duplicados
      // const fieldsReduced = []

      /* fields.forEach(field => {
        // Atribuindo valores aos seus respectivos campos
        values.forEach(value => {
          if (field.id === value.field_id) {
            field.values.push({
              value: value.value,
              user: value.user,
              created_at: value.created_at
            })
          }
        })

        // Removendo campos duplicados
        const duplicated =
          fieldsReduced.findIndex(redField => {
            return field.id === redField.id
          }) > -1

        if (!duplicated) {
          fieldsReduced.push(field)
        }
      }) */

      // Setando dados finais do formulário
      const form = {
        id: formId,
        title: formTitle,
        description: formDescription,
        created_at: formCreatedAt,
        fields
      }

      return res.json(form)
    } catch (err) {
      return res.status(500).json({
        msg:
          'Erro interno do servidor. Por favor, tente novamente ou contate o suporte. '
      })
    }
  }
}

export default new FormController()
