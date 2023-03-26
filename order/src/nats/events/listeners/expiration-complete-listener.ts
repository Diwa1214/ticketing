import {
  Subjects,
  BaseListener,
  ExpirationCompleteEvent,
  OrderStatusEnum,
} from '@dkpackage/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import {Order} from "../../../models/order"

export class ExpirationCompleteListener extends BaseListener<
  ExpirationCompleteEvent
> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatusEnum.Cancelled,
    });
    await order.save();
    
    await new OrderCancelledPublisher(this.client).publisher({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
