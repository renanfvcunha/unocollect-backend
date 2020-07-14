import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  res.json({ msg: 'Hello' })
})

export default routes
