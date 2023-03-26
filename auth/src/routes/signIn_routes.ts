import express from "express"
import { body } from "express-validator"
import { Request,Response } from "express"
import {validationError} from "@dkpackage/common/build/middleware/validate-error"
import {BadRequest} from "@dkpackage/common/build/errors/BadRequest"
import { User } from "../models/user-model"
import { Password } from "../service/password"
import jwt from "jsonwebtoken"


const Router = express.Router()

Router.post("/api/users/signin",
[
  body("email").isEmail().withMessage("Email is invaild"),
  body('password').notEmpty().withMessage('password must be non empty')
],
validationError,
 async function(req:Request,res:Response){
    const {email,password} = req.body
    
    // // existing user
    const userExist = await Promise.resolve(User.findOne({email}))
      if(!userExist){
         throw new BadRequest("Email is not found")
    }
    // // check the password is that match
    const passwordMatch =  await Password.comparePassword(userExist!.password,password)

    if(!passwordMatch){
        throw new BadRequest("Password does not match")
    }

    // // console.log(process.env,"12134");

    // // creating token
    const userjwt = jwt.sign({
        id:userExist.id,
        email: userExist.email
    },process.env.JWTAUTH!)

    req.session ={
        "jwt":userjwt
    }

    return res.send({"user":userjwt,"env":process.env.JWTAUTH})
})


export {Router as SignInRouter}