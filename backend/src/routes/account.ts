import express,{Request,Response} from 'express'
import authMiddleware from '../middleware';
import { AccountModel, UserModel } from '../db';
import StatusCodes from '../StatusCode';
import mongoose from 'mongoose';

const AccRouter = express();

AccRouter.use(express.json());

interface CustomRequest extends Request {
    UserId?: string;
}

AccRouter.get('/balance',authMiddleware,async (req:CustomRequest,res:Response) => {
    console.log('hi ther');
    try{
        const SignedInUserAccount = await AccountModel.findOne({UserId:req.UserId});
        console.log(SignedInUserAccount);
        const balance = SignedInUserAccount?.balance;
        console.log(balance);
        res.status(StatusCodes.OK).json({
            balance : balance
        })
    }catch(err){
        console.log(err);
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            message : 'Service Unavailable'
        })
    }

})

AccRouter.post("/transfer",authMiddleware,async (req:CustomRequest,res:Response) => {
    console.log(req.body);
    const session = await mongoose.startSession();

    session.startTransaction();

    const {amount,to} = req.body;

    const account = await AccountModel.findOne({UserId:req.UserId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(StatusCodes.BADREQUEST).json({
            message : "Insufficient balance"
        })
    }

    const toAccount = await AccountModel.findOne({ UserId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(StatusCodes.BADREQUEST).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await AccountModel.updateOne({ UserId: req.UserId }, { $inc: { balance: -amount } }).session(session);
    await AccountModel.updateOne({ UserId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });
})

export {AccRouter};