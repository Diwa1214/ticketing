import { CustomErrorValidation } from "./CustomErrorValidation";


export class BadRequest extends CustomErrorValidation{

    statusCode: number = 400;
    constructor(public message:string){
        super();
    }

    serializeError() {
        return [{
             "message":this.message
        }]
    }

}