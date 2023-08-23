import { TicketUpdatedEvent } from "@softfabs/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async ()=>{
// create an instance of the event
const listener = new TicketUpdatedListener(natsWrapper.client)
//create and save a ticket

const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price:50,
    title:'concert'
})
await ticket.save();

// create a fake data event
const data: TicketUpdatedEvent['data'] ={
version: ticket.version + 1,
id: ticket.id,
price: ticket.price,
title:'new concert',
userId: new mongoose.Types.ObjectId().toHexString()
}

// create a fake message object
//@ts-ignore
const msg:Message = {

    ack: jest.fn()
}

return { listener, data,ticket, msg};
};


it('finds, updates and saves a ticket', async()=>{

    const {listener, data, ticket, msg} = await setup();

// call the onMessage function with the data object + message object

await listener.onMessage(data, msg);
// write assertions to make sure a ticket was created!
const updatedTicket = await Ticket.findById(ticket.id);

expect(updatedTicket!.title).toEqual(data.title);
expect(updatedTicket!.price).toEqual(data.price);
expect(updatedTicket!.version).toEqual(data.version);

});

it('acks the message', async()=>{
    const {listener, data, msg} = await setup();

// call the onMessage function with the data object + message object
await listener.onMessage(data, msg);


// write assertions to make sure ack function is called!

expect(msg.ack).toHaveBeenCalled();

});


it('does not call ack if the event has a skipped version number', async()=>{

const {msg, data, listener, ticket} = await setup();

data.version = 10
try{

await listener.onMessage(data, msg);
}
catch(err)
{

}

expect(msg.ack).not.toHaveBeenCalled();



});