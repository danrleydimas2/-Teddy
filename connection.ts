import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()
const con = mysql.createConnection({
  host:process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password:process.env.DATABASE_PASS,
  database:process.env.DATABASE_NAME
})

export default con;