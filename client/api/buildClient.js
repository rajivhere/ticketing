import axios from "axios";


const buildClient =  ({req})=>{

     if(typeof window === 'undefined')
     {
        // we are on the server

        return  axios.create({
           // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
           baseURL: 'http://www.ticketing-ms-app-prod.online/',
            headers: req.headers            
        });
     }
     else{
 // must be on the brower here
 return  axios.create({
    baseURL:'/'
 })
     }

}

export default buildClient