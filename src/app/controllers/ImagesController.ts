import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { ImageUserForm } from '../models/ImageUserForm'
import { UserForm } from '../models/UserForm'

class ImageController {
  public async index (req: Request, res: Response) {
    const { formId } = req.params

    try {
      const usersQuery = await getRepository(UserForm)
        .createQueryBuilder('userForm')
        .select(['userForm.user as id', 'user.name as name'])
        .innerJoin('userForm.user', 'user')
        .where('userForm.form = :formId', { formId })
        .orderBy('userForm.user')
        .getRawMany()

      const usersImages = usersQuery.map(userForm => ({
        ...userForm,
        images: []
      }))

      for (let i = 0; i < usersImages.length; i++) {
        const formImages = await getRepository(ImageUserForm)
          .createQueryBuilder('imageUserForm')
          .select(['imageUserForm.name'])
          .innerJoin('imageUserForm.userForm', 'userForm')
          .innerJoin('userForm.form', 'form')
          .innerJoin('userForm.user', 'user')
          .where('form.id = :formId', { formId })
          .andWhere('user.id = :userId', { userId: usersImages[i].id })
          .getRawMany()

        const imgs = formImages.map(
          image => `${process.env.APP_URL}/uploads/${image.imageUserForm_name}`
        )

        usersImages[i].images = imgs
      }

      return res.json(usersImages)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
}

export default new ImageController()
