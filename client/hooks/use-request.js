import axios from "axios";
import React, { useState } from "react";


export default ({url,method,body,onSuccess})=>{
  const [errors,setError] = useState(null)

  const doRequest = async()=>{
    try{
      setError(null)  
      const response = await axios[method](url,body)
      console.log(response);
      if(response.status == 201 || response.status  == 200){
         onSuccess()
      }
    }
    catch(err){
        console.log(err.response.data,"erros");
       return setError(err.response.data)
    }
  }

  return {doRequest,errors}
}