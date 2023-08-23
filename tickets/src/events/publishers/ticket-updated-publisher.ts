import { Publisher, Subjects, TicketUpdatedEvent } from '@softfabs/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>
{
     subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}