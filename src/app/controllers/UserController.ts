import { getRepository } from 'typeorm'
import { User } from '../models/User'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

interface Password {
  password: string
  passwordConf: string
}

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    // Buscando lista de usuários
    const users = await getRepository(User).find()

    // Verificando se não houve retorno
    if (users.length === 0) {
      return res.json({ msg: 'Não há usuários cadastrados.' })
    }

    return res.json(
      users.map(user => ({
        id: user.id,
        registration: user.registration,
        name: user.name,
        username: user.username,
        admin: user.admin ? 'Sim' : 'Não'
      }))
    )
  }

  public async store (req: Request, res: Response): Promise<Response> {
    // Verificando se senhas coincidem
    const { password, passwordConf }: Password = req.body

    if (password !== passwordConf) {
      return res.status(400).json({ msg: 'Senhas não coincidem' })
    }

    // Criptografando senha do usuario
    const passwordHash = await bcrypt.hash(password, 8)

    // Adicionando usuário
    const user = new User()
    user.registration = req.body.registration
    user.name = req.body.name
    user.username = req.body.username
    user.password = passwordHash

    const newUser = await getRepository(User).save(user)

    return res.json(newUser)
  }

  public async show (req: Request, res: Response): Promise<Response> {
    // Capturando id enviando nos parametros
    const { id } = req.params

    // Buscando usuario pelo id
    const user = await getRepository(User).findOne(id)

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' })
    }

    return res.json({
      registration: user.registration,
      name: user.name,
      username: user.username,
      admin: user.admin
    })
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const user = new User()
    user.registration = req.body.registration
    user.name = req.body.name
    user.username = req.body.username
    if (req.body.password) {
      // Verificando se senhas coincidem
      const { password, passwordConf }: Password = req.body

      if (password !== passwordConf) {
        return res.status(400).json({ msg: 'Senhas não coincidem' })
      }

      // Criptografando senha do usuario
      const passwordHash = await bcrypt.hash(password, 8)

      user.password = passwordHash
    }

    // Verificando se usuário existe
    const userToEdit = await getRepository(User).findOne(id)

    if (!userToEdit) {
      return res.status(404).json({ msg: 'Usuário não encontrado' })
    }

    // Editando usuário
    const editedUser = await getRepository(User).update(id, user)

    // Verificando se não houve linha alterada
    if (editedUser.affected === 0) {
      return res.status(500).json({ msg: 'Erro ao editar usuário.' })
    }

    // Exibindo novas informações do usuário
    const { registration, name, username, admin } = await getRepository(
      User
    ).findOne(id)

    return res.json({ registration, name, username, admin })
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const deletedUser = await getRepository(User).delete(id)

    if (deletedUser.affected === 0) {
      return res.status(500).json({ msg: 'Erro ao remover usuário.' })
    }

    return res.json({ msg: 'Usuário removido com sucesso.' })
  }
}

export default new UserController()
