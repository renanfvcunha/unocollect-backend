import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../models/User'

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const hasUser = await getRepository(User).findOne()

    if (!hasUser) {
      return res.status(404).json({ msg: 'Não há usuários cadastrados.' })
    }

    return res.json({ msg: 'Ok!' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
    })
  }
}
