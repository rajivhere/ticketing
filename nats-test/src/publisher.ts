import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { Subjects } from './events/subjects';

console.clear();

//stan is nats terminology for client - reverse read of NATS
const stan = nats.connect('ticketing', 'abc',{
   url: 'http://localhost:4222',

});

stan.on('connect',  ()=>{

    console.log("Publisher connected to NATS");

 const publisher = new TicketCreatedPublisher(stan);
try{
 publisher.publish({
    id: '123',
    title: 'concert',
    price: 20 
 }); 

}
catch(err)
{
   console.log(err);
}

        

});