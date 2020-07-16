import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { FieldValue } from '../models/FieldValue'

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
      const valuesSaved = await getRepository(FieldValue)
        .createQueryBuilder()
        .insert()
        .into(FieldValue)
        .values(valuesWithId)
        .execute()

      return res.json(valuesSaved)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
}

export default new FillController()
