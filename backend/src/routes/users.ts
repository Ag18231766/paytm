import express, { Request,Response } from 'express'
import {z} from 'zod';
import { UserModel } from '../db';
import jwt from 'jsonwebtoken';
import PassKey from '../config';
import StatusCodes from '../StatusCode';
import authMiddleware from '../middleware';
const UserRouter = express();

UserRouter.use(express.json());



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

const UpdateDetailSchema = z.object({
    password : z.string().optional(),
    firstName : z.string().optional(),
    lastName : z.string().optional()
})




UserRouter.get('/',(req:Request,res:Response) => {
    res.send('hi from userrouter');
})

UserRouter.post('/signup',async (req:Request,res:Response) => {
  
    const {success} = UserSchema.safeParse(req.body);
    if(!success){
        return res.send("input format is wrong");
    }


    const isAUser = await UserModel.findOne({userName: req.body.userName});
    if(isAUser){
        return res.status(StatusCodes.CONFLICT).send('User with this userName or firstName already exists');
        
    }


    try{
        const newUser = await UserModel.create({userName: req.body.userName,firstName: req.body.firstName,lastName:req.body.lastName,password:req.body.password});
        const token = jwt.sign({userId : newUser._id.toString()},PassKey);
        res.status(StatusCodes.CREATED).json({
            token : token
        })
    }catch(err){
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            message : 'SERVICE UNAVAILABLE'
        })
    }
})



UserRouter.post('/signin',async (req:Request,res:Response) => {
    const {success} = signInUserSchema.safeParse(req.body);
    if(!success){
        return res.send("input format is wrong");
    }
    
    const {userName,password} = req.body;

    const userRequestingSignIn = await UserModel.findOne({userName : userName,password:password});
    if(!userRequestingSignIn){
        return res.status(StatusCodes.NOT_FOUND).json({
            message : "User doesn't exist"
        })
    }

    const token = jwt.sign({UserId : userRequestingSignIn?._id},PassKey);
    res.status(StatusCodes.OK).json({
        token : token
    })
})


UserRouter.put('/update',authMiddleware,async (req:Request,res:Response) => {
    const {success} = UpdateDetailSchema.safeParse(req.body);
    if(!success){
        return res.status(StatusCodes.BADREQUEST).json({
            message : 'please send valid details'
        })
    }
    try{
        await UserModel.updateOne({_id : req.body.UserId},req.body);
        res.json({
            message : "Updated successfully"
        })
    }catch(err){
        console.log(err);
        res.json({
            message: "Error while updating information"
        })
    }

})



export {UserRouter};