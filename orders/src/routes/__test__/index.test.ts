import request from 'supertest';
import {app} from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const createTicket = async (title: string, price: number)=>{

    const ticket =  Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
          title: title,
          price: price
    });
    await ticket.save();
    return ticket;
}


it("fetches orders for a particular user", async()=>{
//create three tickets

const ticketOne = await createTicket('concert', 20);
const ticketTwo = await createTicket('Movie', 30);
const ticketThree = await createTicket('concert1', 10);

const user1 = global.signin();
const user2 = global.signin();


// create one order as user#1
await request(app)
.post('/api/orders')
.set('Cookie', user1)
.send({
    ticketId: ticketOne.id
})
.expect(201);



//create two orders as user#2

const {body: order1} = await request(app)
.post('/api/orders')
.set('Cookie', user2)
.send({
    ticketId: ticketTwo.id
})
.expect(201);

const {body: order2} = await request(app)
.post('/api/orders')
.set('Cookie', user2)
.send({
    ticketId: ticketThree.id
})
.expect(201);



// make request to get orders for user#2

const res = await request(app)
  .get('/api/orders')
  .set('Cookie', user2)
  .expect(200);



//Make sure we only got the orders for user#2

expect(res.body.length).toEqual(2);
expect(res.body[0].id).toEqual(order1.id);
expect(res.body[1].id).toEqual(order2.id);
expect(res.body[0].ticket.id).toEqual(ticketTwo.id);
expect(res.body[1].ticket.id).toEqual(ticketThree .id);
})