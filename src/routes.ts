import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'
import ReunionController from './app/controllers/ReunionController'
import CategoryController from './app/controllers/CategoryController'
import FillController from './app/controllers/FillController'

const routes = Router()

routes.post('/session', SessionController.store)

// Middleware de autenticação. Todas as rotas abaixo irão exigir autenticação do usuário
routes.use(authMiddleware)

routes.get('/reunions', ReunionController.index)
routes.get('/reunions/:id', ReunionController.show)

routes.post('/fills', FillController.store)

// Middleware de verificação de admin. Todas as rotas abaixo só serão acessíveis por administradores.
routes.use(isAdminMiddleware)

routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.post('/users', UserController.store)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)

routes.get('/categories', CategoryController.index)
routes.post('/categories', CategoryController.store)

routes.post('/reunions', ReunionController.store)

export default routes
