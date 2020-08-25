import { Router } from 'express'
import multer from 'multer'
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

const routes = Router()
const imgs = multer(uploadImgs)

routes.post('/session', SessionController.store)

// Middleware de autenticação. Todas as rotas abaixo irão exigir autenticação do usuário
routes.use(authMiddleware)

routes.get('/fills', FillController.index)
routes.post('/fills/:id', imgs.array('image'), FillController.store)

routes.get('/forms/:id', FormController.show)

// Middleware de verificação de admin. Todas as rotas abaixo só serão acessíveis por administradores.
routes.use(isAdminMiddleware)

routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.post('/users', UserValidator.store, UserController.store)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)

routes.get('/categories', CategoryController.index)
routes.post('/categories', CategoryController.store)

routes.get('/forms', FormController.index)
routes.delete('/forms/:id', FormController.destroy)

routes.post('/forms', FormController.store)

routes.get('/values/:formId', ValueController.show)

routes.get('/userform/:formId', UserFormController.show)

export default routes
