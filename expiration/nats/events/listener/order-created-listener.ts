import { BadRequest, BaseListener, OrderCreatedInterfacr, OrderStatusEnum, Subjects } from "@dkpackage/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../../queue/queue";



export class OrderCreatedListener extends BaseListener<OrderCreatedInterfacr>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "expiration-service";
    async onMessage(event: { id: string; version: number; status: OrderStatusEnum; userId: string; expiresAt: string; ticket: { id: string; price: number; }; }, msg: Message) {
        let delay = new Date(event.expiresAt).getTime() - new Date().getTime()
         await  expirationQueue.add({
              orderId: event?.id
           },{
               delay
           })

           msg.ack()

    }

}