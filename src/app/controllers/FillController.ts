import { Request, Response } from 'express'
import { getRepository, getManager } from 'typeorm'
import { FieldUserValue } from '../models/FieldUserValue'
import { UserForm } from '../models/UserForm'
import { Form } from '../models/Form'
import { ImageUserForm } from '../models/ImageUserForm'
import { Field } from '../models/Field'

interface UserRequest extends Request {
  userId: number
}

interface Location {
  latitude: number
  longitude: number
}

interface Values {
  fieldId: number
  value: string
}

interface ValuesWithId {
  user: number
  fieldId: number
  value: string
}

class FillController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const formsQuery = await getRepository(Form)
        .createQueryBuilder('form')
        .select([
          'form.id',
          'form.title',
          'form.description',
          'field.id',
          'field.name',
          'field.description',
          'field.type',
          'field.options',
          'field.required'
        ])
        .leftJoin('form.fields', 'field')
        .where('form.status = 1')
        .orderBy('form.id', 'DESC')
        .getMany()

      const forms = formsQuery.map(form => ({
        ...form,
        fields: form.fields.map(field => ({
          ...field,
          options: field.options !== '' ? JSON.parse(field.options) : []
        }))
      }))

      return res.json(forms)
    } catch (err) {
      return res.status(500).json({
        msg:
          'Erro interno do servidor. Por favor, tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: UserRequest, res: Response): Promise<Response> {
    const userId = req.userId
    const { id } = req.params
    const { latitude, longitude }: Location = req.body
    const values: string[] = req.body.values
    const date: string = req.body.date
    const valuesParsed = values.map(value => JSON.parse(value))
    const files = req.files

    const filenames: string[] = []
    if (files) {
      for (let i = 0; i < files.length; i++) {
        filenames.push(files[i].filename)
      }
    }

    try {
      await getManager().transaction(async transactionalEntityManager => {
        // Inserindo dados na tabela pivô de usuários e formulários
        const result = await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(UserForm)
          .values([
            {
              latitude: Number(latitude),
              longitude: Number(longitude),
              user: userId,
              form: Number(id),
              created_at: date,
              updated_at: date
            }
          ])
          .execute()

        /**
         * Capturando id inserido na tabela pivô
         */
        const userFormId: number = result.identifiers[0].id

        // Inserindo as respostas na tabela de valores
        const valuesWithId = valuesParsed.map((value: ValuesWithId) => ({
          userForm: userFormId,
          field: value.fieldId,
          value: value.value
        }))

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(FieldUserValue)
          .values(valuesWithId)
          .execute()

        /**
         * Inserindo nomes das imagens na tabela de imagens
         */
        if (filenames.length !== 0) {
          const imagesWithId = filenames.map((filename: string) => ({
            userForm: userFormId,
            name: filename
          }))

          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(ImageUserForm)
            .values(imagesWithId)
            .execute()
        }
      })

      return res.json({ msg: 'Formulário preenchido com sucesso!' })
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'Houve um erro ao preencher o formulário.' })
    }
  }

  public async show (req: Request, res: Response) {
    const { id } = req.params

    try {
      const usersFormsQuery = await getRepository(UserForm)
        .createQueryBuilder('userForm')
        .select(['userForm.id'])
        .where('userForm.form = :id', { id })
        .orderBy('userForm.id')
        .getRawMany()

      const usersForms = usersFormsQuery.map(userForm => userForm.userForm_id)

      const fills = []
      for (let i = 0; i < usersForms.length; i++) {
        const fillsQuery = await getRepository(Field)
          .createQueryBuilder('field')
          .select([
            'field.id',
            'field.name',
            'fieldsUserValue.id',
            'fieldsUserValue.value',
            'fieldsUserValue.created_at',
            'userForm.id',
            'user.id',
            'user.name'
          ])
          .leftJoin('field.fieldsUserValue', 'fieldsUserValue')
          .leftJoin('fieldsUserValue.userForm', 'userForm')
          .leftJoin('userForm.user', 'user')
          .where('field.form = :id', { id })
          .andWhere('userForm.id = :userForm', { userForm: usersForms[i] })
          .getMany()

        const fillsParsed = []
        fillsQuery.map(field => ({
          values: field.fieldsUserValue.map(fieldUserValue =>
            fillsParsed.push({
              [field.id]: fieldUserValue.value,
              created_at: fieldUserValue.created_at,
              created_by: fieldUserValue.userForm
            })
          )
        }))

        const fillsParsedWithName = fillsParsed.map(newFill => ({
          ...newFill,
          created_by: newFill.created_by.user.name
        }))

        let fillAssigned = {}
        for (let i = 0; i < fillsParsedWithName.length; i++) {
          const aux = Object.assign(fillAssigned, fillsParsedWithName[i])
          fillAssigned = aux
        }

        fills.push(fillAssigned)
      }

      return res.json(fills)
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new FillController()
