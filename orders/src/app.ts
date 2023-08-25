import express from "express";
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUserHandler } from "@softfabs/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";
 

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
app.use(newOrderRouter); 
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.all('*', async (req, res)=>{

 // next(new NotFoundError());
throw new NotFoundError();
})


app.use(errorHandler);


export {app};