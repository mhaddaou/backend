import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import userModel from './Models/userModel'
import { retUsers } from './outils/retUsers'
import doteenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

// import cors from 'cors';


const app = express()
const port = 5000
app.use(express.json());
// app.use(cors());

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

// for login
app.post('/login', async(req : Request, res : Response) =>{
  const {username, password} = req.body;
  res.setHeader('Content-Type', 'text/plain');

  const user = await userModel.findOne({username}) ;
  if (!user)
      return res.json({message : " user doesn't exist!"})
  

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if(!isPasswordValid)
      res.json({message : " Username or Password is incorrect"})
  const token = jwt.sign({id : user._id}, `${process.env.SECRET}`);
  
  return res.json({token, userId: user._id});
  
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})
