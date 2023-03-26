import express,{Request,Response} from "express"
import {body} from "express-validator"
import {currentUser,Auth,BadRequest} from "@dkpackage/common"
import { Order } from "../model/order"
import { stripe } from "../../stripe/stripe"

const router = express.Router()


router.post("/api/payment/create", [
    body('token').notEmpty().withMessage("stripe is required"),
    body("orderId").notEmpty().withMessage("orderId is required")
], currentUser,Auth,async(req:Request,res:Response)=>{
    let {orderId} =req.body
    // find the order in payment order model

    let order = await Order.findOne({
        _id:orderId
    })

    if(!order){
       throw new BadRequest("order is not found in payment service")
    }

    let payment =  await stripe.paymentIntents.create({
        amount: order?.ticketPrice,
        currency:"inr",
        payment_method_types:["card"],
        receipt_email:"diwadev1214@gmail.com",
        description:"Your order is successfull"
    })

    res.status(201).send({"payment":payment})

})

export {router as CreatePaymentRouter} 