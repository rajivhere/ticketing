import { natsWrapper } from "../../../nats-wrapper";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@softfabs/common";
import { Order } from "../../../models/order";

const setup = async ()=>{
// create an instance of the event
const listener = new ExpirationCompleteListener(natsWrapper.client)
//create and save a ticket

const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price:50,
    title:'concert'
})
await ticket.save();


// create an order

const order = Order.build({
status: OrderStatus.Created,
userId: 'sdfsdf',
expiresAt: new Date(),
ticket

});

await order.save();

// create a fake expiration event
const data: ExpirationCompleteEvent['data'] ={
orderId: order.id
}

// create a fake message object
//@ts-ignore
const msg:Message = {

    ack: jest.fn()
}

return { listener, data,order, msg};
};


it('updates the order status to cancelled', async()=>{

    const {listener, data, order, msg} = await setup();

// call the onMessage function with the data object + message object

await listener.onMessage(data, msg);
// write assertions to make sure a ticket was created!
const updatedOrder = await Order.findById(order.id);

expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);


});

it('acks the message', async()=>{
    const {listener, data, msg} = await setup();

// call the onMessage function with the data object + message object
await listener.onMessage(data, msg);


// write assertions to make sure ack function is called!

expect(msg.ack).toHaveBeenCalled();

});


it('emits and ordercancelled event', async()=>{

const {msg, data, listener, order} = await setup();




await listener.onMessage(data, msg);
expect(natsWrapper.client.publish).toHaveBeenCalled();
const eventData =JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);''

expect(eventData.id).toEqual(order.id);








});