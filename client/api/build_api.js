import axios from "axios"


const BuildApi = (req)=>{
   console.log(req,"req");
   if(typeof window == "undefined"){
    return axios.create({
        baseURL:"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers:req.headers
     })
    //   server side rendering we need to access the ingress controller
   }
   else{
    return axios.create({
        baseURL:"/",
        headers:req.headers
     })
   }
}

export default BuildApi