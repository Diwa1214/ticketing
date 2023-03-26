
import { Request,Response,NextFunction } from "express"
import {  validationResult } from "express-validator"
import { RequestValidation } from "../errors/RequestValidation"

export const validationError = (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)

    
    if(!errors.isEmpty()){
        console.log(errors,"errors");
         throw new RequestValidation(errors.array())
    }
   return next()
}