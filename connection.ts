import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
const con = mysql.createPool({
  host:process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password:process.env.DATABASE_PASS,
  database:process.env.DATABASE_NAME
})

export default con;