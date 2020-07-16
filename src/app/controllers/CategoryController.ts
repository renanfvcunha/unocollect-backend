import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Category } from '../models/Category'

class CategoryController {
  public async index (req: Request, res: Response): Promise<Response> {
    const categories = await getRepository(Category).find()

    return res.json(categories)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const category = new Category()
    category.name = req.body.name

    const newCategory = await getRepository(Category).save(category)

    return res.json(newCategory)
  }
}

export default new CategoryController()
