import { getRepository } from 'typeorm'
import { User } from '../models/User'
import { Request, Response } from 'express'

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await getRepository(User).find()

    if (users.length === 0) {
      return res.json({ msg: 'Não há usuários cadastrados.' })
    }

    return res.json(users)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const user = new User()
    user.registration = req.body.registration
    user.name = req.body.name
    user.username = req.body.username
    user.password = req.body.password

    const newUser = await getRepository(User).save(user)

    return res.json(newUser)
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const { registration, name, username, admin } = await getRepository(
      User
    ).findOne(id)

    return res.json({ registration, name, username, admin })
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const user = new User()
    user.registration = req.body.registration
    user.name = req.body.name
    user.username = req.body.username
    user.password = req.body.password

    // Verificando se usuário existe
    const userToEdit = await getRepository(User).findOne(id)

    if (!userToEdit) {
      return res.status(400).json({ msg: 'Usuário não encontrado' })
    }

    // Editando usuário
    const editedUser = await getRepository(User).update(id, user)

    // Verificando se não houve linha alterada
    if (editedUser.affected === 0) {
      return res.status(400).json({ msg: 'Erro ao editar usuário.' })
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
      return res.status(400).json({ msg: 'Erro ao remover usuário.' })
    }

    return res.json({ msg: 'Usuário removido com sucesso.' })
  }
}

export default new UserController()
