import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@webma/common';
import { OrderCreatedListener } from '../order-created-lisener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const lisener = new OrderCreatedListener(natsWrapper.client);

  //create and save ticker
  const ticket = Ticket.build({
    title: 'JSmeet',
    price: 100,
    userId: 'fefefgt',
  });
  await ticket.save();

  // create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'fefvdv',
    expiresAt: 'effwfew',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { lisener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { lisener, ticket, data, msg } = await setup();

  await lisener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { lisener, ticket, data, msg } = await setup();

  await lisener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { lisener, ticket, data, msg } = await setup();

  await lisener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
