import express, { Request,Response } from 'express'
import {z} from 'zod';
import { UserModel } from '../db';
import jwt from 'jsonwebtoken';
import PassKey from '../config';
const UserRouter = express();

UserRouter.use(express.json());

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

const signInUserSchema = z.object({
    userName : z.string().email(),
    password: z.string()
})




UserRouter.get('/',(req:Request,res:Response) => {
    res.send('hi from userrouter');
})

UserRouter.post('/signup',async (req:Request,res:Response) => {
  
    const {success} = UserSchema.safeParse(req.body);
    if(!success){
        res.send("input format is wrong");
    }


    const isAUser = await UserModel.findOne({userName: req.body.userName});
    if(isAUser){
        res.status(StatusCodes.CONFLICT).send('User with this userName or firstName already exists');
    }


    try{
        const newUser = await UserModel.create({userName: req.body.userName,firstName: req.body.firstName,lastName:req.body.lastName,password:req.body.password});
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



UserRouter.post('/signin',(req:Request,res:Response) => {
    const {success} = UserSchema.safeParse(req.body);
    if(!success){
        res.send("input format is wrong");
    }
    
    const {userName,password} = req.body;

    const userRequestingSignIn = UserModel.findOne({userName : userName,password:password});
    if(!userRequestingSignIn){
        res.status(StatusCodes.NOT_FOUND).json({
            message : "User doesn't exist"
        })
    }

    const token = jwt.sign({userName},PassKey);
    res.status(StatusCodes.OK).json({
        token : token
    })
})

export {UserRouter};