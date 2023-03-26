import { Request,Response,NextFunction } from "express"
import { InvalidCredentialError } from "../errors/InvalidCredential"

export const Auth = function(req:Request,res:Response,next:NextFunction){
  if(req.currentUser == null){
      throw new InvalidCredentialError()
  }
}

