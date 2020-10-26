import { Publisher, Subjects, TicketCreatedEvent } from '@webma/common';

export class TicetCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
