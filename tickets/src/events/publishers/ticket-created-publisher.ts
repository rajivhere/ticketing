import { Publisher, Subjects, TicketCreatedEvent } from '@softfabs/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>
{
     subject: Subjects.TicketCreated = Subjects.TicketCreated;

}