import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import cors from 'cors'
import routes from './routes'

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
  }

  private routes (): void {
    this.express.use(routes)
  }

  private async database (): Promise<void> {
    await createConnection()
  }
}

export default new App().express
