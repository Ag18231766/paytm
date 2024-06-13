import express from 'express'

const AccRouter = express();

AccRouter.get('/',(req,res) => {
    res.send('hi from accountRouter');
})

export {AccRouter};