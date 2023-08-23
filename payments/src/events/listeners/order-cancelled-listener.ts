import { Listener, OrderCancelledEvent, OrderCreatedEvent, OrderStatus, Subjects } from "@softfabs/common";
import { queueGroupName } from "../queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{

subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

queueGroupName = queueGroupName;

async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

    const order =await Order.findOne({
        _id: data.id,
    version: data.version - 1});


    if(!order)
       {
              console.log("Order Not Found");
              return msg.ack();

       };

    order.set({status: OrderStatus.Cancelled});
    await order.save();
    msg.ack();
    
}

}