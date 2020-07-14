import express from 'express'

class App {
  public express = express.application

  public constructor () {
    this.express = express()
    this.middlewares()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(express.json())
  }

  private routes (): void {
    this.express.get('/', (req, res) => {
      res.json({ msg: 'Hello!!!' })
    })
  }
}

export default new App().express
