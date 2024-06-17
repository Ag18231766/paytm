import { Schema ,model,Types } from "mongoose";


interface User {
    _id : string
    userName : string,
    firstName : string,
    lastName : string,
    password : string
}

interface Account{
    UserId : Types.ObjectId,
    balance : number
}



const userSchema = new Schema<User>({
    _id : Types.ObjectId,
    userName : {type:String,required :true},
    firstName : {type:String,required: true},
    lastName : {type :String,required: false},
    password : {type:String,required:true}
})

const accountSchema = new Schema<Account>({
    UserId : {type:Schema.Types.ObjectId,ref:'User',required:true},
    balance : {type: Number,required:true}
})





const UserModel = model<User>('User',userSchema);
const AccountModel = model<Account>('Account_User',accountSchema);

export {UserModel,AccountModel,User,Account}

