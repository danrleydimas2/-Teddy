import { NextFunction, Request, Response } from "express"
import con from "../../connection.ts"
import { StatusCodes } from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"

import jwt from 'jsonwebtoken'


async function getUser(id: number) {
    con.query(`SELECT * from Users u where u.idusers ='${id}' limit 1 `, async (err, result) => {
            if(!result){
                    return {}
            }
        const convertedResult = JSON.parse(JSON.stringify(result))
        const resultId = convertedResult[0].idusers
        const resultName = convertedResult[0].name
        const resultEmail = convertedResult[0].email

        return { id:resultId, name:resultName, email:resultEmail}
        

    })
   
    return {}

}
export const authMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) { 
        res.status(StatusCodes.UNAUTHORIZED).send("unauthorized")
    }

    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.JWT_PASS) as JwtPayload

    let loggedUser = await getUser(id)
    if(!loggedUser){
         res.status(StatusCodes.UNAUTHORIZED).send("unauthorized")
    }
    next()

}