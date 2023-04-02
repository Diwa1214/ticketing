import { BadRequest, BaseListener, OrderCancelledInterface, Subjects } from "@dkpackage/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../src/model/Ticket";
import { TicketUpdate } from "../TicketUpdation";


export class OrderCancelledPublisher extends BaseListener<OrderCancelledInterface>{
   subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
   queueGroupName = "ticket-service"

   async onMessage(event: { id: string; version: number; ticket: { id: string; }; }, msg: Message) {
        // find the ticket

        console.log("ticket update in ticket service at order cancledd")
        
        let ticket = await Ticket.findOne({
            _id:event?.ticket?.id
        })
        if(!ticket){
           throw new BadRequest("Ticket not found")
        }
        ticket.set({
             orderId:undefined
        })

        await ticket.save()

        await new TicketUpdate(this.client).publisher({
            id:ticket?.id ,
            title:ticket?.title,
            price:ticket?.price,
            userId:ticket?.created_at,
            version:ticket?.version
        })

        msg.ack()
   }
}