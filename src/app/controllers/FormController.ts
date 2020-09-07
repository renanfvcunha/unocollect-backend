import { Request, Response } from 'express'
import { getRepository, getManager } from 'typeorm'

import { Form } from '../models/Form'
import { Field } from '../models/Field'

interface IForm {
  title: string
  description?: string
  created_at?: Date
  category?: number
  status?: number
}

interface Fields {
  form?: number
  name?: string
  description?: string
  type?: string
  options?: string
  required?: boolean
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
            'form.created_at as created_at',
            'category.name as category',
            'COUNT(userForm.id) as fills',
            'form.status as status'
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
            'form.created_at as created_at',
            'category.name as category',
            'COUNT(userForm.id) as fills',
            'form.status as status'
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

      const forms = formsQuery.map((form: IForm) => ({
        ...form,
        category: form.category !== null ? form.category : 'Sem Categoria',
        status: form.status === 1 ? 'Ativo' : 'Inativo',
        created_at: form.created_at
      }))

      return res.json({ forms, total, page: Number(page) })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { title, description, category }: IForm = req.body
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
              title,
              description,
              category
            }
          ])
          .execute()

        // Capturando id inserido no formulário
        const formId: number = result.identifiers[0].id

        // Criando os campos do formulário
        const fieldsWithId = fields.map((field: Fields) => ({
          form: formId,
          name: field.name,
          description: field.description,
          type: field.type,
          options: field.options,
          required: field.required
        }))

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(Field)
          .values(fieldsWithId)
          .execute()
      })

      return res.json({ msg: 'Formulário criado com sucesso!' })
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro Interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      // Buscando formulários com campos e valores
      const form = await getRepository(Form)
        .createQueryBuilder('form')
        .select([
          'form.id',
          'form.title',
          'form.description',
          'form.created_at',
          'category.id',
          'field.id',
          'field.name',
          'field.description',
          'field.created_at'
        ])
        .leftJoin('form.category', 'category')
        .leftJoin('form.fields', 'field')
        .where('form.id = :id', { id })
        .getOne()

      // Verificando se houve retorno
      if (!form) {
        return res
          .status(404)
          .json({ msg: 'Formulário não encontrado na base de dados.' })
      }

      return res.json(form)
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async update (req: Request, res: Response) {
    const { id } = req.params
    const { status } = req.body
    // const { title, description, status, category }: FormInterface = req.body
    // const fields: Fields[] = req.body.fields

    // Verificando se o formulário existe
    const formToEdit = await getRepository(Form).findOne(id)

    if (!formToEdit) {
      return res.status(404).json({ msg: 'Formulário não encontrado!' })
    }

    if (status) {
      try {
        const form = new Form()
        form.status = status

        // Editando Formulário
        const editedForm = await getRepository(Form).update(id, form)

        // Verificando se não houve linha alterada
        if (editedForm.affected === 0) {
          return res.status(500).json({ msg: 'Erro ao editar o formulário.' })
        }

        const newFormStatus = await getRepository(Form).findOne(id)

        if (newFormStatus.status === 1) {
          return res.json({ msg: 'Formulário ativado com sucesso!' })
        } else {
          return res.json({ msg: 'Formulário desativado com sucesso!' })
        }
      } catch (err) {
        return res.status(500).json(err)
      }
    }
  }

  public async destroy (req: Request, res: Response) {
    const { id } = req.params

    try {
      const deletedForm = await getRepository(Form).delete(id)

      if (deletedForm.affected === 0) {
        return res.status(500).json({ msg: 'Erro ao remover formulário.' })
      }

      return res.json({ msg: 'Formulário removido com sucesso!' })
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new FormController()
