import  {Message, Stan} from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event{
  subject: Subjects;
  data: any;

}

export abstract class Listener<T extends Event>{

    abstract subject: T['subject'];   
      abstract queueGroupName: string;
      abstract onMessage(data:T['data'], msg: Message): void;
      private ackWait = 10 * 1000;
      private client: Stan;
   
      constructor(client: Stan) {
         this.client = client
         
      }
   
      subscriptionOptions(){
   
         return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
      }
   
   
    listen(){

      console.log("start listening :", this.subject, this.queueGroupName)
   
      const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
   
      subscription.on('message', (msg: Message) => {
   
        console.log('Message Received');
   
         const parsedData = this.parseMessage(msg);
   
         this.onMessage(parsedData, msg);

         msg.ack();
   
      });
    }
   
    parseMessage(msg: Message)
      {
     const data = msg.getData();
   
     return typeof data === 'string'? JSON.parse(data)
        :JSON.parse(data.toString('utf8'));
         
      }
   
    }

     