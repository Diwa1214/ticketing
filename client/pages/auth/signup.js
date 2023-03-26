import { useState } from "react"
import useRequest from "../../hooks/use-request"
import  {useRouter} from "next/router"

export default ()=>{
    
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const router = useRouter()
    const {doRequest,errors} =   useRequest({
        url:"/api/users/signup",
        method:"post",
        body:{
             email,
             password
        },
        onSuccess:()=>{
            return router.push("/auth/signin")
        }
    })



    const handleEmail =(e)=>{
        setEmail(e.target.value)
    }

    const handlePasssword =(e)=>{
       setPassword(e.target.value)
    }

    const handleSubmit = (e)=>{
       e.preventDefault()
       doRequest()
    }

    return(
        <div style={{width:"100%",justifyContent:"center",alignItems:"center",display:"flex",height:"100vh",background:"rgb(10, 25, 41)"}}>
            <form onSubmit={handleSubmit} style={{width:"50%",justifyContent:"center", alignItems:"center", display:"flex",flexDirection:"column",border:"1px solid rgb(19, 47, 76)",borderRadius:5}}>
              <h3 style={{color:"white",marginTop:"25px"}}>SIGNIN</h3>
                <div className="mb-3" style={{width:"50%"}}>
                    <label  className="form-label" style={{color:"white"}}>Email address</label>
                    <input type="text" value={email} onChange={handleEmail} className="form-control" id="email" placeholder="name@example.com"></input>
                    {errors?.length > 0 && errors.some((item)=>{return item.field == "email"}) ? 
                      ( 
                        
                       <div className="alert alert-danger" role="alert">
                          {errors.map((item)=>{return item.message})}
                      </div>
                      )
                      :null
                    }
                </div>
            

                <div className="mb-3" style={{width:"50%"}}>
                    <label  className="form-label" style={{color:"white"}}>Password</label>
                    <input type="password" value={password} onChange={handlePasssword} className="form-control" id="password" ></input>
                    {errors?.length > 0 && errors.some((item)=>{return item.field == "password"}) ? 
                      ( 
                        
                       <div className="alert alert-danger" role="alert">
                           {errors.map((item)=>{return item.message})}
                      </div>
                      )
                      :null
                    }
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
                
            </form>
        </div>
    )
}
