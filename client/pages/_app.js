import "bootstrap/dist/css/bootstrap.css"
import BuildApi from "../api/build_api"
import Header from "../components/header"


const AppComponent =  ({Component,pageProps,data})=>{
   
   return (
     <>
        <Header currentUser = {null} />
        <Component {...pageProps} />
     </>
   )
}

// AppComponent.getInitialProps = async(appCtx)=>{
//    // const client = BuildApi(appCtx.ctx.req)
//    // const {data} = await client.get("/api/users/current_user")
//    console.log(appCtx.ctx.req.headers,"index");
//    let pageProps =  {}
//    if(appCtx.Component.getInitialProps){
//      pageProps = await appCtx.Component.getInitialProps(appCtx.ctx)
//    }
//    return {pageProps}
// }

export default AppComponent