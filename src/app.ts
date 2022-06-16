import 'reflect-metadata'
import express from 'express'
import path from 'path'
import { createConnection } from 'typeorm'
import cors from 'cors'

import routes from './routes'
import dbConfig from './database/config'

class App {
  public express = express.application

  public constructor () {
    this.express = express()
    this.middlewares()
    this.routes()
    this.database()
  }

  private middlewares (): void {
    this.express.use(cors())
    this.express.use(express.json())
    this.express.use(
      '/uploads',
      express.static(path.resolve(__dirname, 'uploads', 'formImages'))
    )
  }

  private routes (): void {
    this.express.use(routes)
  }

  private async database (): Promise<void> {
    await createConnection(dbConfig).then(() => console.log('DB Connected!'))
  }
}

export default new App().express
