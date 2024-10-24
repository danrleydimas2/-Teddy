import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/CreateUser.dto.ts";
import con from '../../connection.ts'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Connection } from "mysql2/typings/mysql/lib/Connection";

type JwtPayload = {
  id: number
}
dotenv.config()


export function getUsers(req: Request, res: Response) {
  con.query('SELECT * FROM Users', (err, result) => {
    if (err) {
      res.send(err)
    }
    res.send(result)
  })
}

export async function createUser(req: Request<{}, {}, CreateUserDto>, res: Response) {

  const { name, email, password } = req.body
  const hashPassword = await bcrypt.hash(password, 10)
  con.query(`INSERT INTO Users VALUES (null,'${name}', '${email}', '${hashPassword}')`, (err, result) => {

    if (err) {
      res.send(err)
    }

    res.status(StatusCodes.CREATED).send("successfully created")
  })


}
export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  con.query(`SELECT * from Users u where u.email ='${email}' limit 1 `, async (err, result) => {

    if (err) {
      res.send(err)
    }

    if (!result) {
      return {}
    }
    const convertedResult = JSON.parse(JSON.stringify(result))


    if (convertedResult.length === 0) {
      return res.status(StatusCodes.FORBIDDEN).send('invalid email or password')
    }

    const resultId = convertedResult[0].idusers
    const resultName = convertedResult[0].name
    const resultEmail = convertedResult[0].email
    const resultPassword = convertedResult[0].password

    const verifyPass = await bcrypt.compare(password, resultPassword)
    if (!verifyPass) {
      res.status(StatusCodes.FORBIDDEN).send('invalid email or password')
    }

    const token = jwt.sign({ id: resultId }, process.env.JWT_PASS, { expiresIn: '1d' })

    res.status(StatusCodes.ACCEPTED).send({
      id: resultId,
      name: resultName,
      email: resultEmail,
      password: '',
      token

    })


  })

  



}

export async function profile(req: Request, res: Response) {

  res.status(StatusCodes.ACCEPTED).send("welcome")
}

export function deleteUser(req: Request, res: Response) {

}