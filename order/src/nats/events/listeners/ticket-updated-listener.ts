import { Message } from 'node-nats-streaming';
import { Subjects, BaseListener, TicketUpdatedInterface } from '@dkpackage/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../../models/ticket';

export class TicketUpdatedListener extends BaseListener<TicketUpdatedInterface> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedInterface['data'], msg: Message) {
    console.log(data,"data");
    
    const ticket = await Ticket.findOne({ _id: data.id});

    console.log(ticket,"ticket");
    

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    await ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
