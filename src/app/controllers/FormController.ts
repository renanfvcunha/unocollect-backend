import { Request, Response } from 'express'
import { getRepository, getManager, createQueryBuilder } from 'typeorm'
import { Form } from '../models/Form'
import { Field } from '../models/Field'
import { User } from '../models/User'
import { FormStatus } from '../models/FormStatus'

interface FormInterface {
  title: string
  description?: string
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
    const forms = await getRepository(Form).find()

    return res.json(forms)
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

    const form = await createQueryBuilder(Form)
      .innerJoinAndSelect('Form.fields', 'field')
      .where('Form.id = :id', { id })
      .getOne()

    return res.json(form)
  }
}

export default new FormController()