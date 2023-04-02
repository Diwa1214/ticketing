
import { Nat } from "../nats/config";
import  {BadRequest} from "@dkpackage/common"
import { OrderCreatedListener } from "../nats/events/listener/order-created-listener";



const startservice = async ()=>{


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

    // new TicketCreatedListener(Nat.client).listen()
    // new TicketUpdatedListener(Nat.client).listen()

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
    
}

startservice()

