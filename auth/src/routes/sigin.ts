import express, { Request, Response} from 'express';
import {body} from  'express-validator'
import {BadRequestError, validateRequest } from '@softfabs/common';
import {User} from '../models/User';
import { PasswordManager } from '../services/password-mgr';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/api/users/signin',
[
 
body('email')
.isEmail()
.withMessage("Email must be valid"),
body('password')
.trim()
.notEmpty()
.withMessage("You must supply a password")
], validateRequest,

async (req: Request, res: Response)=>{
   const {email, password} = req.body;

   const existingUser = await User.findOne({email});
   if(!existingUser)
   {
      throw new BadRequestError('Invalid credentials');
   }

   const passwordsMatch = await PasswordManager.compare(existingUser.password, password);

   if(!passwordsMatch)
   {
      throw new BadRequestError("Invalid Credentials");
   }


   //generate jwt 

   const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
  },   process.env.JWT_KEY! );

  // store it on session object

  req.session = {
      jwt: userJwt
  };


  return res.status(200).send(existingUser);

 
});

export {router as signinRouter};
