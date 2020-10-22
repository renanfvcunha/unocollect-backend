import { Router } from 'express'
import uploadImgs from './config/uploadImgs'

import UserValidator from './app/validators/UserValidator'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'
import FormController from './app/controllers/FormController'
import CategoryController from './app/controllers/CategoryController'
import FillController from './app/controllers/FillController'
import ValueController from './app/controllers/ValueController'
import UserFormController from './app/controllers/UserFormController'
import ImageController from './app/controllers/ImageController'
import GroupController from './app/controllers/GroupController'

import checkToken from './app/utils/checkToken'

const routes = Router()

routes.get('/checktoken', checkToken)
routes.post('/session', SessionController.store)

// Middleware de autenticação. Todas as rotas abaixo irão exigir autenticação do usuário
routes.use(authMiddleware)

routes.get('/fills', FillController.index)
routes.post('/fills/:id', uploadImgs.array('image'), FillController.store)

routes.get('/forms/:id', FormController.show)

// Middleware de verificação de admin. Todas as rotas abaixo só serão acessíveis por administradores.
routes.use(isAdminMiddleware)

routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.post('/users', UserValidator.store, UserController.store)
routes.put('/users/:id', UserValidator.update, UserController.update)
routes.delete('/users/:id', UserController.destroy)

routes.get('/categories', CategoryController.index)
routes.post('/categories', CategoryController.store)
routes.put('/categories/:id', CategoryController.update)
routes.delete('/categories/:id', CategoryController.destroy)

routes.get('/forms', FormController.index)
routes.post('/forms', FormController.store)
routes.put('/forms/:id', FormController.update)
routes.delete('/forms/:id', FormController.destroy)

routes.get('/fills/:id', FillController.show)
routes.get('/fills/export/:id', FillController.export)
routes.get('/fillsperday', FillController.fillsPerDay)

routes.get('/values/:formId', ValueController.show)

routes.get('/userform/:formId', UserFormController.show)

routes.get('/images/:formId', ImageController.index)

routes.get('/groups', GroupController.index)
routes.post('/groups', GroupController.store)
routes.put('/groups/:id', GroupController.update)
routes.delete('/groups/:id', GroupController.destroy)

export default routes
