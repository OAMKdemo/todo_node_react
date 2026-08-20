import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const environment = process.env.NODE_ENV || 'development'
const database = environment === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
})

export { pool }
