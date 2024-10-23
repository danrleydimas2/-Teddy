
import express from 'express'
import con from '../connection.ts'
import { Router, Request, Response } from 'express';


const app = express();

const route = Router()

app.use(express.json())
route.get('/urls', (req: Request, res: Response) => {
  con.query('SELECT * FROM URLS',(err,result)=>{
    if(err){
      res.send(err)
    }
    res.send(result)
  })
})
route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello world with Typescript' })
})

app.use(route)

export default app