import express from 'express';
import { Router } from './routes';
import {connect} from 'mongoose';
const app = express();

const dbUrl = 'mongodb://localhost:27017/paytm';
app.use('/api/v1',Router);




connect(dbUrl).then(() => console.log('connected to db')).catch((err) => console.log("can't connect to db"));
app.listen(5000,() => {
    console.log('running on 5000');
})