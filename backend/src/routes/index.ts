import express from 'express';
import { AccRouter } from './account';
import { UserRouter } from './users';

const Router = express();

Router.use('/users',UserRouter);
Router.use('/accounts',AccRouter);

export {Router}