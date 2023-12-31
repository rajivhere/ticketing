import request from 'supertest';
import {app} from '../../app';

import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';


it('marks an order cancelled', async ()=>{
//Create a ticket

const ticket = Ticket.build({

    id: new mongoose.Types.ObjectId().toHexString(),
    title:'Concert',
    price: 20
})

await ticket.save();

const user =global.signin();
// make a request to build an order with this ticket

const { body: order} =await request(app)
  .post('/api/orders')
  .set('Cookie', user)
  .send({ ticketId: ticket.id})
  .expect(201);


// make request to  cancel the order
await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(204);

//expectation to make sure that the order is cancelled
const updatedOrder = await Order.findById(order.id);

expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  
});

it('emits a order cancelled event', async ()=>{


  //Create a ticket

const ticket = Ticket.build({
  id: new mongoose.Types.ObjectId().toHexString(),
  title:'Concert',
  price: 20
})

await ticket.save();

const user =global.signin();
// make a request to build an order with this ticket

const { body: order} =await request(app)
.post('/api/orders')
.set('Cookie', user)
.send({ ticketId: ticket.id})
.expect(201);


// make request to  cancel the order
await request(app)
.delete(`/api/orders/${order.id}`)
.set('Cookie', user)
.send()
.expect(204);


expect(natsWrapper.client.publish).toHaveBeenCalled();

});


