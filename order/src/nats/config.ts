import { Stan } from "node-nats-streaming"
import nats from "node-nats-streaming"

interface BaseConnectionInfo{
    clusterId:string,
    clientId:string,
}

interface BaseConnection extends BaseConnectionInfo{
    url:string
}

class NatsStreamingServerConnection {
   private _client!: Stan;

   get client(){
     return this._client
   }

   connect(connection:BaseConnection){
      try {
        return new Promise((resolve,reject)=>{
            this._client =  nats.connect(connection.clusterId,connection.clientId,{
                    url:connection.url
                })
            
            this._client.on('connect',()=>{
                    console.log('Connected to NATS');
                   resolve(this._client)  
            })
            this._client.on('error',(err)=>{
                console.error(err,"Err")
                reject(err) 
            })
            
           
          })
      }
      catch(err){
        console.log(err,"Error in catch in Nats streaming");
        
      } 
   }
}

export const Nat = new NatsStreamingServerConnection()