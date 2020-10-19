import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Category } from '../models/Category'

class CategoryController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const categories = await getRepository(Category).find()

      return res.json(categories)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const category = new Category()
    category.name = req.body.name

    try {
      await getRepository(Category).save(category)

      return res.json({ msg: 'Categoria adicionada com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte. '
      })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const group = new Category()
    group.name = req.body.name

    try {
      await getRepository(Category).update(id, group)

      return res.json({ msg: 'Categoria editada com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte. '
      })
    }
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      await getRepository(Category).delete(id)

      return res.json({ msg: 'Categoria removida com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new CategoryController()
