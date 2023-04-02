import express from "express";
import "express-async-errors"
import {json} from "body-parser"
import cookieSession from "cookie-session"; 
import mongoose from "mongoose";
import { RequestErrorHandling,BadRequest,currentUser } from "@dkpackage/common";
import { PostNewTicket } from "./routes/new_tickets";
import { GetTicket } from "./routes/get_tickets";
import { UpdateTicket } from "./routes/update_ticket";
import { Nat } from "../nats/config";
import { OrderCreatedListener } from "../nats/events/listener/order-created-listener";
import { OrderCancelledPublisher } from "../nats/events/listener/order-cancelled-listener";

const app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(json())

// signed is set to encrypt
// secure is set only allow https
app.use(cookieSession({
    signed:false,
    secure:true
}))



app.use(PostNewTicket)
app.use(GetTicket)
app.use(UpdateTicket)

app.use(RequestErrorHandling)



const startservice = async ()=>{
    if(!process.env.JWTAUTH){
         throw new BadRequest("Jwt is undefined")
    }

    if(!process.env.MONGO_URI){
        throw new BadRequest("MONGO URI is not undefined")
    }

    if(!process.env.CLUSTER_ID){
        throw new BadRequest("CLUSTER_ID is not undefined")
    }
    if(!process.env.NATS_URL){
        throw new BadRequest("NATS_URL is not undefined")
    }
    if(!process.env.CLIENT_ID){
        throw new BadRequest("CLIENT_ID is not undefined")
    }

    let connection = {
        clusterId:process.env.CLUSTER_ID,
        clientId:process.env.CLIENT_ID,
        url:process.env.NATS_URL
    }

    await Nat.connect(connection)

    new OrderCreatedListener(Nat.client).listen()
    new OrderCancelledPublisher(Nat.client).listen()
    
    Nat.client.on('close',()=>{
        console.log('Nats streaming server closed');
        process.exit()
    })

   

    process.on("SIGINT",()=>{
        return Nat.client.close()
    })
    process.on("SIGTERM",()=>{
        return Nat.client.close()
    })
    mongoose.connect(process.env.MONGO_URI).then((res)=>{
      console.log("DB connected to Ticket service")
    }).catch((err)=>{
          console.error(err)
    })
    app.listen(5000,()=>{
        console.log('Ticket service is Listening on port 5000!!!!')
    })
}

startservice()

