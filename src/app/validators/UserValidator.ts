import { Request, Response, NextFunction } from 'express'

interface IUser {
  id?: number
  name?: string
  username?: string
  password: string
  passwordConf: string
}

class UserValidator {
  public store (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    const { name, username, password, passwordConf }: IUser = req.body

    // Verificando se todos os campos estão preenchidos
    if (!name || !username || !password || !passwordConf) {
      return res.status(400).json({
        msg: 'Verifique se todos os campos estão preenchidos corretamente!'
      })
    }

    // Verificando se senhas coincidem
    if (password !== passwordConf) {
      return res.status(400).json({ msg: 'Senhas não coincidem!' })
    }

    // Verificando se não há espaços no username
    const stringSpace = (string: string) => /\s/g.test(string)

    if (stringSpace(username)) {
      return res
        .status(400)
        .json({ msg: 'Nome de usuário não pode conter espaços!' })
    }

    return next()
  }

  public update (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    const { name, username, password, passwordConf }: IUser = req.body
    if (req.body.password) {
      // Verificando se senhas coincidem
      if (password !== passwordConf) {
        return res.status(400).json({ msg: 'Senhas não coincidem!' })
      }
    }

    // Verificando se todos os campos estão preenchidos
    if (!name || !username) {
      return res.status(400).json({
        msg: 'Verifique se todos os campos estão preenchidos corretamente!'
      })
    }

    // Verificando se não há espaços no username
    const stringSpace = (string: string) => /\s/g.test(string)

    if (stringSpace(username)) {
      return res
        .status(400)
        .json({ msg: 'Nome de usuário não pode conter espaços!' })
    }

    return next()
  }
}

export default new UserValidator()
