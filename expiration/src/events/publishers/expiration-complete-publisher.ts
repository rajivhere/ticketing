import { Publisher, ExpirationCompleteEvent, Subjects } from "@softfabs/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{

     subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
 
}