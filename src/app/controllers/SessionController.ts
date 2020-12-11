import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getRepository } from 'typeorm'

import { User } from '../models/User'
import authConfig from '../../config/auth'

interface Session {
  username: string
  password: string
}

class SessionController {
  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { username, password }: Session = req.body

      // Buscando usuário no banco
      const user = await getRepository(User)
        .createQueryBuilder('user')
        .where('username = :username', { username })
        .getOne()

      // Verificando se usuário não existe
      if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' })
      }

      // Verificando se a senha está incorreta
      const userPass = await bcrypt.compare(password, user.password)

      if (!userPass) {
        return res.status(401).json({ msg: 'Senha incorreta!' })
      }

      const { id, name, admin } = user

      // Retornando informações do usuário com o token de autenticação
      return res.json({
        user: { id, name, admin },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg:
          'Erro interno do servidor. Por favor, tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new SessionController()
