import express, { NextFunction,Request,Response } from 'express'
import {z} from 'zod';
import { UserModel } from '../db';
import jwt from 'jsonwebtoken';
import PassKey from '../config';
const UserRouter = express();


enum StatusCodes {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    CONFLICT = 409,
    SERVICE_UNAVAILABLE = 503
}

const UserSchema = z.object({
    userName : z.string().email(),
    firstName : z.string(),
    lastName : z.string().optional(),
    password : z.string().min(8)
})


UserRouter.post('/signup',async (req:Request,res:Response,next:NextFunction) => {
    const {userName,firstName,lastName,password} = req.body;
    const {success} = UserSchema.safeParse({userName,firstName,lastName,password});
    if(!success){
        res.send("input format is wrong");
    }
    const isAUser = await UserModel.findOne({userName,firstName});
    if(isAUser){
        res.status(StatusCodes.CONFLICT).send('User with this userName or firstName already exists');
    }
    try{
        const newUser = await UserModel.create({userName,firstName,lastName,password});
        const token:string = jwt.sign({userId : newUser._id},PassKey);
        res.status(StatusCodes.CREATED).json({
            token : token
        })
    }catch(err){
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            message : 'SERVICE UNAVAILABLE'
        })
    }
})

UserRouter.get('/',(req:Request,res:Response) => {
    res.send('hi from userrouter');
})

export {UserRouter};