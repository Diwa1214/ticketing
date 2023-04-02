import axios from "axios"


const BuildApi = (req)=>{
   if(typeof window == "undefined"){
      //  we are on server so the request is http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/......
      // we set header in Host to ticketing.dev and set the cookies received from node
    return axios.create({
        baseURL:"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers:req.headers
     })
    //   server side rendering we need to access the ingress controller
   }
   else{
      // we are on browser 
    return axios.create({
        baseURL:"/",
        headers:req.headers
     })
   }
}

export default BuildApi