import { Message } from 'node-nats-streaming';
import { Subjects, BaseListener, TicketCreatedInterface } from '@dkpackage/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../../models/ticket';

export class TicketCreatedListener extends BaseListener<TicketCreatedInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedInterface['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
