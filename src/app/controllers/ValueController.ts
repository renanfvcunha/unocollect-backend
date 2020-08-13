import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { Field } from '../models/Field'

class ValueController {
  public async show (req: Request, res: Response): Promise<Response> {
    const { formId } = req.params

    const valuesQuery = await getRepository(Field)
      .createQueryBuilder('field')
      .select([
        'field.id',
        'fieldUserValue.value as value',
        `fieldUserValue.created_at at time zone 'utc' as created_at`,
        'user.name as created_by'
      ])
      .leftJoin('field.fieldsUserValue', 'fieldUserValue')
      .leftJoin('fieldUserValue.userForm', 'userForm')
      .leftJoin('userForm.user', 'user')
      .where('field.form = :formId', { formId })
      .getRawMany()

    const adjustedValues = valuesQuery.map(value => ({
      [value.field_id]: value.value,
      created_at: value.created_at,
      created_by: value.created_by
    }))

    const values = [Object.assign(adjustedValues[0], adjustedValues[1])]
    /* for (let i = 0; i < adjustedValues.length; i++) {
      const newArr = Object.assign(
        adjustedValues[i % 2],
        adjustedValues[(i % 2) + 1]
      )
      values.push(newArr)
    } */

    return res.json(values)
  }
}

export default new ValueController()
