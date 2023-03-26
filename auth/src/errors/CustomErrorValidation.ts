

 export abstract class CustomErrorValidation  extends Error{
   abstract statusCode:number

   constructor(){
     super()
   }

   abstract serializeError():{message:string,field?:string}[]
}

