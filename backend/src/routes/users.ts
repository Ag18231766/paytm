import express from 'express'

const UserRouter = express();

UserRouter.get('/',(req,res) => {
    res.send('hi from userrouter');
})

export {UserRouter};