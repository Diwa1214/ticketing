import { CustomErrorValidation } from "./CustomErrorValidation";


export class InvalidCredentialError extends CustomErrorValidation{
    statusCode = 401;

    constructor(){
        super()
    }

    serializeError() {
        return [{message:"Invalid credentials"}]
    }
}