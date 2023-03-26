import express ,{Request,Response} from "express"
import {body,validationResult}  from "express-validator"
import {BadRequest,DataBaseValidation,RequestValidation} from "@dkpackage/common"
import { User } from "../models/user-model"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/api/users/signup",[
  body("email").isEmail().withMessage("Email is not valid"), 
  body("password").isLength({min:3,max:5}).withMessage("Password must be between 3 and 5 characters") ]
  ,async(req:Request,res:Response)=>{
  const errors = validationResult(req)
  const {email,password} = req.body

  if(!errors.isEmpty()){
    throw new RequestValidation(errors.array())   
  }
  // check existing user
  const existingUser = await Promise.resolve(User.findOne({ email }))

  if(existingUser){
      throw new BadRequest("Email is already in DB try any other email")
  }
 
  const user  =  User.buildUser({ email: email, password: password })
  // const userJwt =jwt.sign({user},process.env.JWTAUTH!)

  // req.session ={
  //   'jwt':userJwt
  // }


  await user.save()
  res.status(201).send(user)

})

export { router as SignUpRouter}