
import {BaseListener,OrderCreatedInterfacr, Subjects,OrderStatusEnum} from "@dkpackage/common"
import {Message} from "node-nats-streaming"
import { Order } from "../../../src/model/order"

export class OrderCreatedListener extends BaseListener<OrderCreatedInterfacr>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = "payment-service"

    async onMessage(event:OrderCreatedInterfacr["data"],msg:Message){
  
        try{
            console.log(event);
        
        // insert order info into order model
        const create_order = await Order.build({
            id: event?.id,
            ticketPrice: event?.ticket?.price,
            userId: event?.userId,
            status: OrderStatusEnum?.AwaitingPayment
        })
        await create_order.save()
        

        msg.ack()
        }
        catch(err){
            console.log(err);
            
        }
       
         
    }

}