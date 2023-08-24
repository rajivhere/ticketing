//import buildClient from '../api/buildClient';
import Link from 'next/link';

const LandingPage = function ({currentUser, tickets}) {

   const ticketList = tickets.map(ticket =>
       {return (<tr key={ ticket.id}>
               <td> {ticket.title}</td>
               <td> {ticket.price}</td>
               <td><Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>View </Link> </td>

       </tr>
         
         )});


return (<div>
   <h2>Tickets</h2>
   <table className="table">
      <thead>
         <tr>
            <th>Title</th>
            <th>Price</th>     
            <th>Link</th>       
         </tr>
      </thead>
      <tbody>
        {ticketList}
      </tbody>
   </table>
</div>);
  
 
};


LandingPage.getInitialProps = async (context, client, currentUser)=>{

 /*  console.log("LANDING PAGE");
 const client =  buildClient(context);
   const {data } = await client.get('/api/users/currentuser');
   return data; */
   
   const {data } = await client.get('/api/tickets');

   return { tickets: data}
};

export default LandingPage;