import { Publisher, OrderCreatedEvent, Subjects } from "@softfabs/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{

     subject: Subjects.OrderCreated = Subjects.OrderCreated;
 
}