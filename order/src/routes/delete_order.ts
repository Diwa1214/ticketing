import express,{Request,Response} from "express"

const router = express.Router()

router.delete('/api/order/update/:orderId',(req:Request,res:Response)=>{
   return res.status(200).send({})
})

export {router as DeleteOrderRouter}