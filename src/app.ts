
import express from 'express'

import { Router, Request, Response } from 'express';

import  usersRouter  from './routes/users.ts'
import urlsRouter from './routes/urls.ts'

const app = express()

const route = Router()
app.use(express.json())



app.use('/api/users',usersRouter)
app.use('/',urlsRouter)

app.use(route)

export default app