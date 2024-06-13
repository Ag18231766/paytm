import express from 'express';
import { Router } from './routes';
const app = express();

app.use('/api/v1',Router);

app.listen(5000,() => {
    console.log('running on 5000');
})