import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import userModel from './Models/userModel'
import { retUsers } from './outils/retUsers'
import doteenv from 'dotenv'

import cors from 'cors'


const app = express()
const port = 4000
app.use(express.json());
app.use(cors)
doteenv.config();


mongoose.connect(`mongodb+srv://mhaddaou:iQ8Ij9h9GgfBNZeC@cluster0.baz83mq.mongodb.net/mern?retryWrites=true&w=majority`).then(() =>{
    console.log('db connection established')
}).catch((err) =>{
    console.log('db connection error ', err )
})



app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel')
})

app.get('/ping', (_req: Request, res: Response) => {
  return res.send('pong 🏓')
})

// get all users
app.get('/users', async (req : Request, res : Response) => {
    const users = await userModel.find();
    const ret = await retUsers(users);
    res.json(ret);
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})
