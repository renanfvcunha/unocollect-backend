import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { Form } from '../models/Form'
import { Field } from '../models/Field'

interface IForm {
  title: string
  description?: string
  created_at?: Date
  category?: number
  status?: number
  groups?: number[]
}

interface Fields {
  id?: number
  form?: { id: number }
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
        .where('form.title like :title', { title: '%' + search + '%' })
        .orWhere('category.name like :category', {
          category: '%' + search + '%'
        })
        .getCount()

      let formsQuery: Form[] = []
      if (search) {
        formsQuery = await getRepository(Form)
          .createQueryBuilder('form')
          .select([
            'form.id',
            'form.title',
            'form.created_at',
            'category.name',
            'group',
            'userForm.id',
            'form.status'
          ])
          .leftJoin('form.category', 'category')
          .leftJoin('form.groups', 'group')
          .leftJoin('form.userForm', 'userForm')
          .orderBy('form.id', 'DESC')
          .where('form.title like :title', { title: '%' + search + '%' })
          .orWhere('category.name like :category', {
            category: '%' + search + '%'
          })
          .take(Number(per_page))
          .skip((Number(page) - 1) * Number(per_page))
          .getMany()

        total = totalFiltered
      } else {
        formsQuery = await getRepository(Form)
          .createQueryBuilder('form')
          .select([
            'form.id',
            'form.title',
            'form.created_at',
            'category.name',
            'group',
            'userForm.id',
            'form.status'
          ])
          .leftJoin('form.category', 'category')
          .leftJoin('form.groups', 'group')
          .leftJoin('form.userForm', 'userForm')
          .orderBy('form.id', 'DESC')
          .take(Number(per_page))
          .skip((Number(page) - 1) * Number(per_page))
          .getMany()

        total = totalCount
      }

      const forms = formsQuery.map(form => ({
        ...form,
        category: form.category !== null ? form.category.name : 'Sem Categoria',
        status: form.status === 1 ? 'Ativo' : 'Inativo',
        created_at: form.created_at,
        groups: form.groups.map(group => group.name).join(', '),
        fills: form.userForm.length,
        userForm: undefined
      }))

      return res.json({ forms, total, page: Number(page) })
    } catch (err) {
      return res.status(500).json({
        err
        /* msg: 'Erro Interno do servidor. Tente novamente ou contate o suporte.' */
      })
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { title, description, category, groups }: IForm = req.body
    const fields: Field[] = req.body.fields

    // Verificando se já existe formulário com o mesmo título
    const formQuery = await getRepository(Form).findOne({
      where: { title }
    })
    if (formQuery) {
      return res
        .status(400)
        .json({ msg: 'Já existe um formulário com este título.' })
    }

    try {
      // Parseando id dos grupos
      const formGroups = groups.map(id => ({
        id
      }))

      // Criando o nome e descrição do formulário
      const form = new Form()
      form.title = title
      form.description = description
      form.category = { id: category }
      form.groups = formGroups
      form.fields = fields.map(field => ({
        ...field,
        options: JSON.stringify(field.options)
      }))

      await getRepository(Form).save(form)

      return res.json({ msg: 'Formulário criado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro Interno do servidor. Tente novamente ou contate o suporte.'
      })
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
          'form.created_at',
          'category.id',
          'group',
          'field.id',
          'field.name',
          'field.description',
          'field.type',
          'field.options',
          'field.required'
        ])
        .leftJoin('form.category', 'category')
        .leftJoin('form.fields', 'field')
        .leftJoin('form.groups', 'group')
        .where('form.id = :id', { id })
        .getOne()

      // Verificando se houve retorno
      if (!formQuery) {
        return res
          .status(404)
          .json({ msg: 'Formulário não encontrado na base de dados.' })
      }

      const fields = formQuery.fields.map(field => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : ['']
      }))

      const form = {
        ...formQuery,
        groups: formQuery.groups.map(group => group.id),
        fields
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
    const { title, description, category, groups, status }: IForm = req.body
    const fields: Field[] = req.body.fields

    try {
      // Verificando se o formulário existe
      const formToEdit = await getRepository(Form).findOne(id)

      if (!formToEdit) {
        return res.status(404).json({ msg: 'Formulário não encontrado!' })
      }

      // Verificando se já existe formulário com o mesmo título
      const formTitleQuery = await getRepository(Form).findOne({
        where: { title }
      })
      const formQuery = await getRepository(Form).findOne({
        where: { id }
      })
      if (formTitleQuery && formTitleQuery.title !== formQuery.title) {
        return res
          .status(400)
          .json({ msg: 'Já existe um formulário com este título.' })
      }

      const form = new Form()
      if (status) {
        form.status = status

        // Editando Formulário
        await getRepository(Form).update(id, form)

        const newFormStatus = await getRepository(Form).findOne(id)

        if (newFormStatus.status === 1) {
          return res.json({ msg: 'Formulário ativado com sucesso!' })
        } else {
          return res.json({ msg: 'Formulário desativado com sucesso!' })
        }
      } else {
        // Parseando id dos grupos
        const formGroups = groups.map(id => ({
          id
        }))

        // Definindo campos do formulário
        form.id = Number(id)
        form.title = title
        form.description = description
        if (category !== null) {
          form.category = { id: category }
        }
        form.groups = formGroups

        // Consulta aos campos existentes do formulário
        const fieldsIdsQuery = await getRepository(Field).find({
          select: ['id'],
          join: {
            alias: 'field',
            innerJoin: {
              form: 'field.form'
            }
          },
          where: { form: { id: Number(id) } }
        })

        const bodyIds = fields.map(field => field.id)
        const fieldsIds = fieldsIdsQuery.map(field => field.id)

        /**
         * Comparando ids enviados no corpo da requisição com ids existentes
         * no banco para saber se algum será deletado.
         */
        const idsToRemove: number[] = []
        for (let i = 0; i < fieldsIds.length; i++) {
          if (bodyIds.indexOf(fieldsIds[i]) === -1) {
            idsToRemove.push(fieldsIds[i])
          }
        }

        await Promise.all([
          fields.map(async fld => {
            /**
             * Verificando se há id no campo. Se houver, será uma atualização.
             * Senão, será uma adição
             */
            if (fld.id) {
              const field = new Field()
              field.name = fld.name
              field.description = fld.description
              field.type = fld.type
              field.options = JSON.stringify(fld.options)
              field.required = fld.required

              await getRepository(Field).update(fld.id, field)
            } else {
              const field = new Field()
              field.name = fld.name
              field.description = fld.description
              field.type = fld.type
              field.options = JSON.stringify(fld.options)
              field.required = fld.required
              field.form = { id: Number(id) }

              await getRepository(Field).save(field)
            }
          }),
          // Removendo Ids verificados anteriormente
          idsToRemove.map(async id => {
            await getRepository(Field).delete(id)
          })
        ])
          .then(async () => {
            // Atualizando formulário
            await getRepository(Form).save(form)
          })
          .catch(() => {
            return res.status(500).json({
              msg: 'Ocorreu um erro ao atualizar os campos do formulário.'
            })
          })

        return res.json({ msg: 'Formulário editado com sucesso!' })
      }
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte. '
      })
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
