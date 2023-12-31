import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@softfabs/common";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup =async ()=>{

    const listener = new OrderCancelledListener(natsWrapper.client);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created,
        userId: 'sdfsd',
        version: 0

        
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,     
        ticket: {
            id: "sdfdf",
          
        }
    };

    //@ts-ignore
    const msg: Message ={
        ack: jest.fn()
    }


return { listener, data, order, msg};


};

it('updates the status of the  order', async ()=>{

    const { listener, data, msg}= await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);


});

it('acks the message', async ()=>{
 const { listener, data, msg}= await setup();

    await listener.onMessage(data, msg);

expect(msg.ack).toHaveBeenCalled();
});