import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import userModel from './Models/userModel'
import { retUsers } from './outils/retUsers'
import doteenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cors from 'cors'
export const check = (req : Request) =>{
  const {password, confirm, username, email} = req.body;
  const passhashed = bcrypt.hashSync(password, 10);
  return password === confirm ? {username, email, password : passhashed } : null;
}

const app = express()
const port = 5000
app.use(express.json());
doteenv.config();


mongoose.connect(`mongodb+srv://mhaddaou:iQ8Ij9h9GgfBNZeC@cluster0.baz83mq.mongodb.net/mern?retryWrites=true&w=majority`).then(() =>{
    console.log('db connection established')
}).catch((err) =>{
    console.log('db connection error ', err )
})


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

// to register new user
app.post('/register', async(req :Request, res : Response) =>{
    
  const user = check(req) ;
  res.setHeader('Content-Type', 'text/plain');

  
  const username = req.body.username;
  const exist = await userModel.findOne({username})
  if (exist)
  return res.status(421).json({message : "username alredy exist"});

  if (!user)
      return res.status(422).json({ message: "the password is not same" });
  
  const newUser = new userModel(user);
  await newUser.save();
  
  res.json({message : "user created successfully"});
});

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