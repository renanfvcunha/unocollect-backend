import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Group } from '../models/Group'

class GroupController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const groups = await getRepository(Group).find()

      return res.json(groups)
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const group = new Group()
    group.name = req.body.name

    try {
      await getRepository(Group).save(group)

      return res.json({ msg: 'Grupo adicionado com sucesso!' })
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte. '
      })
    }
  }
}

export default new GroupController()
