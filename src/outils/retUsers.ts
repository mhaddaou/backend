import { IUsers } from "../Models/userModel"

export const retUsers = async (user : IUsers[]) =>{
    const ret = user.map(({username, email, _id}) =>{
        return {username, email, _id}
    })
    return ret;
}