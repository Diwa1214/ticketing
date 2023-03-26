import BuildApi from "../api/build_api";


const LandingPage =  function({data}){
    console.log(data,"index")

    return (
        <div>
            <h4>Hai</h4>
        </div>
    )
}

LandingPage.getInitialProps = async({req})=>{
    console.log("Landing page");
    const client = BuildApi(req)
    const {data} = await client.get("/api/users/current_user")
    console.log(data);
    return {data}
}

export default LandingPage