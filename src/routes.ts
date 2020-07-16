import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'

const routes = Router()

routes.post('/session', SessionController.store)

// Middleware de autenticação. Todas as rotas abaixo irão exigir autenticação do usuário
routes.use(authMiddleware)

// Middleware de verificação de admin. Todas as rotas abaixo só serão acessíveis por administradores.
routes.use(isAdminMiddleware)

routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.post('/users', UserController.store)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)

export default routes
