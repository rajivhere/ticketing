import request from 'supertest';
import {app} from '../../app';



const createTicket =  (title: string, price: number)=>{

return  request(app)
.post('/api/tickets')
.set('Cookie', global.signin())
.send({
 title,
 price
})


};


it('can fetch a list of tickets', async ()=>{

   await createTicket('ticket1', 20);
   await createTicket('ticket2', 10);
   await createTicket('ticket3', 30);

   const res = await request(app)
   .get('/api/tickets')   
   .send()
   .expect(200);

   expect(res.body.length).toEqual(3);


});