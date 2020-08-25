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

    try {
      await getRepository(Category).save(category)

      return res.json({ msg: 'Categoria adicionada com sucesso!' })
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte. '
      })
    }
  }
}

export default new CategoryController()
