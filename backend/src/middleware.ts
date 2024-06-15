import StatusCodes from "./StatusCode";
import { Request,Response,NextFunction, response } from "express";
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import PassKey from "./config";
import { any, object, string } from "zod";

interface UserPayload extends JwtPayload{
    UserId: string
}

interface CustomRequest extends Request {
    UserId?: string;
}


const authMiddleware = (req:CustomRequest,res:Response,next:NextFunction) => {
    const {authheader} = req.headers;
    if(!authheader || Array.isArray(authheader)){
        // console.log(req.headers);
        res.json({
            message : 'authorization key not found'
        })
        return;
    }
    
    const token:string = authheader.split(' ')[1];
    console.log(token);
    try{
        const decoded = jwt.verify(token,PassKey) as UserPayload;
        
        if(decoded){
            req.UserId = decoded.UserId;
            console.log('hi there');
            next();
        }
    }catch(err){
        return res.status(StatusCodes.FORBIDDEN).json({});
    }
    

}


export default authMiddleware;