import { getRepository } from 'typeorm'
import { User } from '../models/User'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

interface IUser {
  id?: number
  registration?: number
  name?: string
  username?: string
  admin?: boolean
  password?: string
  passwordConf?: string
}

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const { per_page, page, search } = req.query

    try {
      // Buscando total de registros
      let total: number
      const totalCount = await getRepository(User).count()
      const totalFiltered = await getRepository(User)
        .createQueryBuilder()
        .select()
        .where('name like :name', { name: '%' + search + '%' })
        .orWhere('username like :username', {
          username: '%' + search + '%'
        })
        .getCount()

      // Verificando se registro será ou não filtrado
      let usersQuery = []
      if (search) {
        usersQuery = await getRepository(User)
          .createQueryBuilder()
          .select(['id', 'registration', 'name', 'username', 'admin'])
          .where('name like :name', { name: '%' + search + '%' })
          .orWhere('username like :username', {
            username: '%' + search + '%'
          })
          .limit(Number(per_page))
          .offset((Number(page) - 1) * Number(per_page))
          .execute()

        total = totalFiltered
      } else {
        usersQuery = await getRepository(User)
          .createQueryBuilder()
          .select(['id', 'registration', 'name', 'username', 'admin'])
          .limit(Number(per_page))
          .offset((Number(page) - 1) * Number(per_page))
          .orderBy('id', 'DESC')
          .execute()

        total = totalCount
      }

      const users = usersQuery.map(user => ({
        ...user,
        admin: user.admin ? 'Sim' : 'Não'
      }))

      return res.json({ users, total, page: Number(page) })
    } catch (error) {
      return res.status(500).json({
        msg:
          'Erro Interno do Servidor. Por favor, tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const { registration, name, username, admin, password }: IUser = req.body

      // Criptografando senha do usuario
      const passwordHash = await bcrypt.hash(password, 8)

      // Adicionando usuário
      const user = new User()
      user.registration = registration
      user.name = name
      user.username = username
      user.admin = admin
      user.password = passwordHash

      await getRepository(User).save(user)

      return res.json({ msg: 'Usuário Cadastrado Com Sucesso!' })
    } catch (err) {
      return res.status(500).json({
        msg:
          'Erro interno do servidor. Por favor, tente novamente ou contate o suporte.'
      })
    }
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
      const { password, passwordConf }: IUser = req.body

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
    await getRepository(User).findOne(id)

    return res.json({ msg: 'Usuário alterado com sucesso!' })
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const deletedUser = await getRepository(User).delete(id)

    if (deletedUser.affected === 0) {
      return res.status(500).json({ msg: 'Erro ao remover usuário.' })
    }

    return res.json({ msg: 'Usuário removido com sucesso!' })
  }
}

export default new UserController()
