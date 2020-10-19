import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { UserForm } from '../models/UserForm'
import utils from '../utils'

class UserFormController {
  public async show (req: Request, res: Response): Promise<Response> {
    const { formId } = req.params

    try {
      const userFormQuery = await getRepository(UserForm)
        .createQueryBuilder('userForm')
        .select([
          'userForm.id as id',
          'userForm.latitude as latitude',
          'userForm.longitude as longitude',
          'userForm.created_at as created_at',
          'user.name as created_by'
        ])
        .innerJoin('userForm.user', 'user')
        .where('userForm.form_id = :formId', { formId })
        .orderBy('userForm.created_at')
        .getRawMany()

      const userForm = userFormQuery.map(userForm => ({
        id: userForm.id,
        latitude: userForm.latitude,
        longitude: userForm.longitude,
        created_at: utils.parseDate(userForm.created_at),
        created_by: userForm.created_by
      }))

      return res.json(userForm)
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  }
}

export default new UserFormController()
