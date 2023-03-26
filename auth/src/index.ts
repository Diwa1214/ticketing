import express from "express";
import "express-async-errors"
import {json} from "body-parser"
import { SignInRouter } from "./routes/signIn_routes";
import cookieSession from "cookie-session"; 
import mongoose from "mongoose";
import { RequestErrorHandling,BadRequest } from "@dkpackage/common";
import { SignUpRouter } from "./routes/signUp_routes";
import { CurrentuserRouter } from "./routes/current_user";
import { SignoutRouter } from "./routes/signout";

const app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(json())

// signed is set to encrypt
// secure is set only allow https
app.use(cookieSession({
    signed:false,
    secure:true
}))

app.get("/api/users/currentuser",(req,res)=>{
   return res.send("Welcome to nginx")
})

app.use(SignInRouter)
app.use(SignUpRouter)
app.use(CurrentuserRouter)
app.use(SignoutRouter)

app.use(RequestErrorHandling)


const startservice = ()=>{
    if(!process.env.JWTAUTH){
         throw new BadRequest("Jwt is undefined")
    }
    mongoose.connect("mongodb://auth-db-service/auth").then((res)=>{
      console.log("DB connected successfullysddsds")
    }).catch((err)=>{
          console.error(err)
    })
    app.listen(3000,()=>{
        console.log('Auth service is Listening on port 3000!!!!')
    })
}

startservice()

