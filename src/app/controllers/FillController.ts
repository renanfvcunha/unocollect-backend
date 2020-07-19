import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { FieldUserValue } from '../models/FieldUserValue'

interface UserRequest extends Request {
  userId: number
}

class FillController {
  public async store (req: UserRequest, res: Response): Promise<Response> {
    const userId = req.userId
    const { values } = req.body

    const valuesWithId = values.map(value => ({
      user: userId,
      field: value.fieldId,
      value: value.value
    }))

    try {
      const valuesSaved = await getRepository(FieldUserValue)
        .createQueryBuilder()
        .insert()
        .into(FieldUserValue)
        .values(valuesWithId)
        .execute()

      return res.json(valuesSaved.generatedMaps)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
}

export default new FillController()
