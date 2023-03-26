import express from "express";
import "express-async-errors"
import {json} from "body-parser"
import cookieSession from "cookie-session"; 
import mongoose from "mongoose";
import { RequestErrorHandling,BadRequest,currentUser } from "@dkpackage/common";
import { Nat } from "./nats/config";
import { GetOrderList } from "./routes/get_order";
import { CreateNewOrderRouter } from "./routes/new_order";
import { UpdateOrderRouter } from "./routes/update_order";
import { DeleteOrderRouter } from "./routes/delete_order";
import { TicketCreatedListener } from "./nats/events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./nats/events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./nats/events/listeners/expiration-complete-listener";


const app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(json())

// signed is set to encrypt
// secure is set only allow https
app.use(cookieSession({
    signed:false,
    secure:true
}))


app.use(GetOrderList)
app.use(CreateNewOrderRouter)
app.use(UpdateOrderRouter)
app.use(DeleteOrderRouter)


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

    new TicketCreatedListener(Nat.client).listen()
    new TicketUpdatedListener(Nat.client).listen()
    new ExpirationCompleteListener(Nat.client).listen()

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
      console.log("DB connected to order service")
    }).catch((err)=>{
          console.error(err)
    })
    app.listen(4000,()=>{
        console.log('order service is Listening on port 4000!!!!')
    })
}

startservice()

