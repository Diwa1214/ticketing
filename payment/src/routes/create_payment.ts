import express,{Request,Response} from "express"
import {body} from "express-validator"
import {currentUser,Auth,BadRequest, OrderStatusEnum} from "@dkpackage/common"
import { Order } from "../model/order"
import { stripe } from "../../stripe/stripe"

const router = express.Router()


router.post("/api/payment/create", [
    body('token').notEmpty().withMessage("stripe is required"),
    body("orderId").notEmpty().withMessage("orderId is required")
], currentUser,Auth,async(req:Request,res:Response)=>{
   try{
    let {orderId} =req.body
    // find the order in payment order model

    let order = await Order.findOne({
        _id:orderId
    })

    if(order?.userId !== req.currentUser?.id){
        new BadRequest("you not authorize to order this ticket in payment service")
    }

    if(order?.status === OrderStatusEnum?.Cancelled){
        throw new BadRequest("your order is expired to create a payment")
    }


    if(!order){
       throw new BadRequest("order is not found in payment service")
    }

    let payment =  await stripe.paymentIntents.create({
        amount: order.ticketPrice,
        currency:"inr",
        automatic_payment_methods: {enabled: true},

    })

    

    res.status(201).send({"payment":payment})
   }
   catch(err){
      console.log(err,"Err")
   }

})

export {router as CreatePaymentRouter} 