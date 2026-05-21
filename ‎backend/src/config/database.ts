import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
})

pool.on('error', (err: Error) => {
  console.error('Erro inesperado no pool do banco:', err)
})

export default pool
