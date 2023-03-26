
import {ValidationError} from "express-validator"
import { CustomErrorValidation } from "./CustomErrorValidation"

export class RequestValidation extends CustomErrorValidation {
   statusCode:number = 400
   constructor(private error:ValidationError[]){
      super()
    //   Object.setPrototypeOf(this,RequestValidation.prototype)
   } 

   serializeError(){
     return this.error.map((err)=>{
          return {'message':err.msg,'field':err.param}
      })
   }

   
}