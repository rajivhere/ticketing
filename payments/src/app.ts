import express from "express";
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUserHandler } from "@softfabs/common";
import { CreateChargeRouter } from "./routes/new";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
         //secure: process.env.NODE_ENV !== 'test'
         secure: false,
    })
)
app.use(currentUserHandler);
app.use(CreateChargeRouter);

app.all('*', async (req, res)=>{

 // next(new NotFoundError());
throw new NotFoundError();
})


app.use(errorHandler);


export {app};