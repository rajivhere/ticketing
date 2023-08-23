import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';



it('fetches the order', async ()=>{
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


// make request to  fetch the order

const {body: fetchOrder} = await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});


it('return an error when one user tries to fetch the order of another user', async ()=>{
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
    
    
    // make request to  fetch the order
    
  await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(401);
    
      
    });
