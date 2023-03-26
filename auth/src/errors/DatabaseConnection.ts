import { CustomErrorValidation } from "./CustomErrorValidation"


export class DataBaseValidation extends CustomErrorValidation {
   errors = "DB connection is failed" 
   statusCode = 500
   constructor(){
      super()
    //   Object.setPrototypeOf(this,RequestValidation.prototype)
   } 

   serializeError(){
      return [
         {
            "message":this.errors
         }
      ]
   }
   
}