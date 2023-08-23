import mongoose, { set } from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"

import { OrderCancelledEvent, OrderStatus } from "@softfabs/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async ()=>{
//create an instance of the listener
const listener = new OrderCancelledListener(natsWrapper.client);

//create and save a ticket
const orderId = new mongoose.Types.ObjectId().toHexString();
const ticket = Ticket.build({
    title:'concert',
    price:60,
    userId:'sdfasdf',
    
});

ticket.set({orderId})
await ticket.save();

//Create a fake data event
const data: OrderCancelledEvent['data'] ={

    id: orderId,
    version: 0,  
    ticket: {
        id: ticket.id
        
    }
};

//create a fake message
//@ts-ignore
const msg: Message ={
ack: jest.fn()

};

return {listener, ticket , data , msg};

}

it("udpates the ticket with order cancelled status", async ()=>{

    const{listener, data, msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    const udpatedTicket = await Ticket.findById(ticket.id);

    expect(udpatedTicket!.orderId).not.toBeDefined();



});

it("acks the message", async ()=>{

    const{listener, data, msg, ticket} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();


});

it("publishes a ticket updated event", async ()=>{

    const{listener, data, msg, ticket} = await setup();
    await listener.onMessage(data, msg);

    
expect(natsWrapper.client.publish).toHaveBeenCalled();


/* const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

expect(data.id).toEqual(ticketUpdatedData.orderId); */
});