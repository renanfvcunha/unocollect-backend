import * as path from 'path'
import { ConnectionOptions } from 'typeorm'

const dbConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', 'app', 'models', '*.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  cli: {
    migrationsDir: path.join(__dirname, 'migrations'),
    entitiesDir: path.join(__dirname, '..', 'app', 'models')
  },
  synchronize: false
}

export default dbConfig

module.exports = dbConfig
