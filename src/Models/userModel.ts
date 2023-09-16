import {Schema, model} from 'mongoose'

import mongoose, { Document } from 'mongoose';

export interface IUsers extends Document{
    username : string;
    email : string;
    password : string;
}

export const userSchema = new Schema({
    username :{
        type : String,
        required : true,
        unique : true,
    },
    email :{
        type : String,
        required : true,
    },
    password : {
        type: String,
        required : true,
    },
})

const userModel = model("users",userSchema);
export default userModel;