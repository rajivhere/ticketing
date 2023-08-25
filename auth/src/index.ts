import mongoose from 'mongoose';
import {app} from './app';

const start = async ()=>{
    console.log("Starting up service.....");
try{

if(!process.env.JWT_KEY)
{
    throw new Error("JWT_KEY must be defined");
}

if(!process.env.MONGO_URI)
{
    throw new Error("MONGO_URI must be defined")
}

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
}
catch(err)
{
    console.log("Error connecting to DB ", err)
}
app.listen(3000, ()=>{

    console.log("Auth service started... listening on port 3000!!")
});
};

start();

