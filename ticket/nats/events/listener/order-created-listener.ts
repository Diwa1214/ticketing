import { BadRequest, BaseListener, OrderCreatedInterfacr, OrderStatusEnum, Subjects } from "@dkpackage/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../src/model/Ticket";
import { TicketUpdate } from "../TicketUpdation";


export class OrderCreatedListener extends BaseListener<OrderCreatedInterfacr>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "ticket-service";
    async onMessage(event: { id: string; version: number; status: OrderStatusEnum; userId: string; expiresAt: string; ticket: { id: string; price: number; }; }, msg: Message) {
        // find the ticket in ticket model
        const findTicket = await Ticket.findOne({
            _id:event?.ticket?.id
        })

        if(!findTicket){
           throw new BadRequest("Ticket is not found in ticket service")
        }

        await findTicket.set({
            orderId:event?.id
        })

        await findTicket.save()

        new TicketUpdate(this.client).publisher({
            id:findTicket?.id,
            title:findTicket?.title,
            price:findTicket?.price,
            userId:findTicket?.created_at,
            version:findTicket?.version
        })

    }

}