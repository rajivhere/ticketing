import { Publisher, OrderCancelledEvent, Subjects } from "@softfabs/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{

     subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
 
}