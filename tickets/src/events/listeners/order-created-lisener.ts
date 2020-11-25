import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@webma/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Fint the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // Mark the ticket as being by setting its orderId property
    ticket.set({
      orderId: data.id,
    });

    // Save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
