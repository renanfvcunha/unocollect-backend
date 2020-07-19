import { Request, Response } from 'express'
import { getRepository, getManager, createQueryBuilder } from 'typeorm'
import { Form } from '../models/Form'
import { Field } from '../models/Field'
import { User } from '../models/User'
import { FormStatus } from '../models/FormStatus'

interface FieldInterface {
  form: number
  name: string
  description: string
}

class FormController {
  public async index (req: Request, res: Response): Promise<Response> {
    const forms = await getRepository(Form).find()

    return res.json(forms)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { fields } = req.body

    try {
      const form = await getManager().transaction(
        async transactionalEntityManager => {
          // Criando o nome e descrição do formulário
          const result = await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Form)
            .values([
              {
                category: null,
                title: req.body.title,
                description: req.body.description
              }
            ])
            .execute()

          // Criando os campos do formulário
          const formId: number = result.identifiers[0].id

          const fieldsWithId = fields.map(
            field =>
              <FieldInterface>{
                form: formId,
                name: field.name,
                description: field.description
              }
          )

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
        }
      )
      return res.json(form)
    } catch (err) {
      return res.status(500).json(err)
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
