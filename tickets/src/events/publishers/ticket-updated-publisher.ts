import { Publisher, Subjects, TicketUpdatedEvent } from '@webma/common';

export class TicketUpdatedPulisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
