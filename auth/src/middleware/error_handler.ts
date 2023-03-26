import { Request,Response,NextFunction } from "express"
import { CustomErrorValidation } from "../errors/CustomErrorValidation"

export const RequestErrorHandling = function(err:Error,req:Request,res:Response,next:NextFunction){
   if(err instanceof CustomErrorValidation){
     res.status(err.statusCode).send(err.serializeError())
   }
  
} 