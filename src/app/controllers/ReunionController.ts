import { Request, Response } from 'express'
import { getRepository, getManager, createQueryBuilder } from 'typeorm'
import { Reunion } from '../models/Reunion'
import { Field } from '../models/Field'

interface FieldInterface {
  reunion: number
  name: string
  description: string
}

class ReunionController {
  public async index (req: Request, res: Response): Promise<Response> {
    const reunions = await getRepository(Reunion).find()

    return res.json(reunions)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { fields } = req.body

    try {
      const reunion = await getManager().transaction(
        async transactionalEntityManager => {
          const result = await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Reunion)
            .values([
              {
                category: null,
                title: req.body.title,
                description: req.body.description
              }
            ])
            .execute()

          const id = result.identifiers[0].id

          const fieldsWithId = fields.map(
            field =>
              <FieldInterface>{
                reunion: id,
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
        }
      )
      return res.json(reunion)
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const reunion = await createQueryBuilder(Reunion)
      .innerJoinAndSelect('Reunion.fields', 'field')
      .where('Reunion.id = :id', { id })
      .getOne()

    return res.json(reunion)
  }
}

export default new ReunionController()
