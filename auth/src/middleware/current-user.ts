
import { Request,Response,NextFunction } from "express"
import jwt from "jsonwebtoken"

interface userPayload {
    email:string,
    password:string
}

declare global{
    namespace Express{
       interface Request{
           currentUser:userPayload | null
       }  
    }
}

export const currentUser = async function(req:Request,res:Response,next:NextFunction){
  if(req.session?.jwt! == null){
    console.log("Hia");
    
    req.currentUser = null 
    next()
  }
  console.log("jwt");
  const decodeJwt= await jwt.verify(req.session?.jwt,process.env.JWTAUTH!) as userPayload
  console.log("jwt",decodeJwt);

  req.currentUser = decodeJwt 
  return res.status(200).send({currentuser:req.currentUser})

}

// Comment
