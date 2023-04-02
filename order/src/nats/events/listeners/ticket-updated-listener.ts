import { Message } from 'node-nats-streaming';
import { Subjects, BaseListener, TicketUpdatedInterface } from '@dkpackage/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../../models/ticket';

export class TicketUpdatedListener extends BaseListener<TicketUpdatedInterface> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedInterface['data'], msg: Message) {
    
    const ticket = await Ticket.findOne({ _id: data.id,version:data?.version - 1});

    console.log(ticket,"ticket in order service in updatinf the ticket");
    

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    await ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
