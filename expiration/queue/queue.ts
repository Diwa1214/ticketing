import Queue from "bull"
import { ExpirationCompletedPublisher } from "../nats/events/publisher/expiration-completed"
import {Nat} from "../nats/config"


interface Payload {
     orderId:string
}

export const expirationQueue = new Queue<Payload>('expiration-queue',{
    redis:{
        host:process.env.REDIS_HOST
    }
})

try{
    expirationQueue.process(async (job)=>{
        
        await new ExpirationCompletedPublisher(Nat.client).publisher({
            orderId:job?.data?.orderId
        })

    })
}
catch(err){
     console.log(err,"error in queue process");
     
}