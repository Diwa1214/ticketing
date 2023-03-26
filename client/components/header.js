import Link from 'next/link'

const Header = ({currentUser})=>{

    let link =  currentUser ? [
      {
         "name":"SignOut",
         "href" :"/auth/signin"
      }
 ] :  [
         {
            "name":"SignIn",
            "href" :"/auth/signin"
         },
         {
            "name":"SignUp",
            "href" :"/auth/signup"
         },
    ]

     return (
        <div style={{width:"100%",height:"50px",background:"rgb(10, 25, 41)"}}>
            <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",height:"50px"}}>
                 {link?.map((items,index)=>{
                   return (
                      <>
                        <div style={{display:"flex",flexDirection:"row",marginLeft:20}} key={Math.random()}>
                             <Link href={items.href} >{items.name}</Link>
                        </div>
                      </>
                   )
                 })}
            </div>
        </div>
     )
}

export default Header