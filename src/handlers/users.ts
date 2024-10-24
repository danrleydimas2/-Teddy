import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/CreateUser.dto.ts";
import con from '../../connection.ts'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


type JwtPayload = {
  id: number
}
dotenv.config()


export async function getUsers(req: Request, res: Response) {
  try {
    const query ='SELECT * FROM Users'
    const [ rows ] = await con.execute( query )
  
    res.status(StatusCodes.OK).send(rows)   
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Erro no servidor', error: err });
    
  }
 

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
  
  try {
    const query =`INSERT INTO Users VALUES (null,'${name}', '${email}', '${hashPassword}')`
    const [ rows ] = await con.execute( query )
  
    res.status(StatusCodes.CREATED).send("successfully created")   
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Erro no servidor', error: err });
    
  }
 
  


}
export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    const query =`SELECT * from Users u where u.email ='${email}' limit 1 `
    const [ rows ] = await con.execute( query )

    const convertedResult = JSON.parse(JSON.stringify(rows))


    if (convertedResult.length === 0) {
      res.status(StatusCodes.FORBIDDEN).send('invalid email or password')
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
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Erro no servidor', error: err });
    
  }
  



}

export async function profile(req: Request, res: Response) {

  res.status(StatusCodes.ACCEPTED).send("welcome")
}

export function deleteUser(req: Request, res: Response) {

}