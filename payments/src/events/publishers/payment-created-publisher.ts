import { PaymentCreatedEvent, Publisher, Subjects } from "@softfabs/common";




export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{

    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;


}