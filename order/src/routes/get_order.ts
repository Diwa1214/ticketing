import express,{Request,Response} from "express"

const router = express.Router()


router.get('/api/order',(req:Request,res:Response)=>{
   return res.status(200).send({})
})


export  {router as GetOrderList }