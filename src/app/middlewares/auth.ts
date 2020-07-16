import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import authConfig from '../../config/auth'

interface Decoded {
  id?: number
}

interface UserRequest extends Request {
  userId: number
}

export default async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Verificando se o token foi enviado no cabeçalho da requisição
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ msg: 'Token não enviado!' })
  }

  // Capturando token enviado
  const [, token] = authHeader.split(' ')

  // Verificando se token enviado não foi alterado
  try {
    const decoded: Decoded = await promisify(jwt.verify)(
      token,
      authConfig.secret
    )
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido!' })
  }
}
