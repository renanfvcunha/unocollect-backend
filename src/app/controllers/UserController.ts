import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'

import { User } from '../models/User'
import authConfig from '../../config/auth'

interface IUser {
  id?: number
  name?: string
  username?: string
  admin?: boolean
  groups?: number[]
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
      let usersQuery: User[] = []
      if (search) {
        usersQuery = await getRepository(User)
          .createQueryBuilder('user')
          .select([
            'user.id',
            'user.name',
            'user.username',
            'user.admin',
            'group'
          ])
          .leftJoin('user.groups', 'group')
          .where('user.name like :name', { name: '%' + search + '%' })
          .orWhere('username like :username', {
            username: '%' + search + '%'
          })
          .take(Number(per_page))
          .skip((Number(page) - 1) * Number(per_page))
          .orderBy('user.id', 'DESC')
          .getMany()

        total = totalFiltered
      } else {
        usersQuery = await getRepository(User)
          .createQueryBuilder('user')
          .select([
            'user.id',
            'user.name',
            'user.username',
            'user.admin',
            'group'
          ])
          .leftJoin('user.groups', 'group')
          .take(Number(per_page))
          .skip((Number(page) - 1) * Number(per_page))
          .orderBy('user.id', 'DESC')
          .getMany()

        total = totalCount
      }

      const users = usersQuery.map(user => ({
        ...user,
        admin: user.admin ? 'Sim' : 'Não',
        groups: user.groups.map(group => group.name).join(', ')
      }))

      return res.json({ users, total, page: Number(page) })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { name, username, admin, groups, password }: IUser = req.body

    try {
      // Verificando se não há usuário com mesmo username
      const usernameQuery = await getRepository(User).findOne({
        select: ['username'],
        where: { username }
      })
      if (usernameQuery) {
        return res
          .status(400)
          .json({ msg: 'Já existe um usuário com este nome de usuário.' })
      }

      // Parseando id dos grupos
      const userGroups = groups.map(id => ({
        id
      }))

      // Criptografando senha do usuario
      const passwordHash = await bcrypt.hash(password, 8)

      // Adicionando usuário
      const user = new User()
      user.name = name
      user.username = username
      user.admin = admin
      user.groups = userGroups
      user.password = passwordHash

      await getRepository(User).save(user)

      return res.json({ msg: 'Usuário Cadastrado Com Sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async storeFirstUser (req: Request, res: Response): Promise<Response> {
    const { name, username, password }: IUser = req.body

    try {
      // Verificando se não há usuários cadastrados
      const hasUser = await getRepository(User).findOne()

      if (hasUser) {
        return res
          .status(403)
          .json({ msg: 'Já há usuários cadastrados no sistema.' })
      }

      // Criptografando senha do usuario
      const passwordHash = await bcrypt.hash(password, 8)

      // Adicionando usuário
      const user = new User()
      user.name = name
      user.username = username
      user.admin = true
      user.password = passwordHash

      const newUser = await getRepository(User).save(user)

      const { id, admin } = newUser

      return res.json({
        user: { id, name, admin },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async show (req: Request, res: Response): Promise<Response> {
    // Capturando id enviando nos parametros
    const { id } = req.params

    try {
      // Buscando usuario pelo id
      const user = await getRepository(User).findOne(id, {
        relations: ['groups']
      })

      if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' })
      }

      return res.json({
        name: user.name,
        username: user.username,
        admin: user.admin,
        groups: user.groups.map(group => group.id)
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, username, admin, groups, password }: IUser = req.body

    try {
      // Verificando se não há usuário com mesmo username
      const usernameQuery = await getRepository(User).findOne({
        select: ['username'],
        where: { username }
      })
      const userQuery = await getRepository(User).findOne({
        select: ['username'],
        where: { id }
      })
      if (usernameQuery && usernameQuery.username !== userQuery.username) {
        return res
          .status(400)
          .json({ msg: 'Já existe um usuário com este nome de usuário.' })
      }

      // Parseando id dos grupos
      const userGroups = groups.map(id => ({
        id
      }))

      const user = new User()
      user.id = Number(id)
      user.name = name
      user.username = username
      user.admin = admin
      user.groups = userGroups
      if (password) {
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
      await getRepository(User).save(user)

      return res.json({ msg: 'Usuário alterado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      const deletedUser = await getRepository(User).delete(id)

      if (deletedUser.affected === 0) {
        return res.status(500).json({ msg: 'Erro ao remover usuário.' })
      }

      return res.json({ msg: 'Usuário removido com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new UserController()
