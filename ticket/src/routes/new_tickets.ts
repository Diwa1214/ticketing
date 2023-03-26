import { Auth, currentUser, validationError } from "@dkpackage/common"
import express from "express"
import { body } from "express-validator"
import { Request,Response } from "express"
import { Ticket } from "../model/Ticket"
import { TicketCreation } from "../../nats/events/TicketCreation"
import { Nat } from "../../nats/config"

const router = express.Router()

router.post('/api/ticket/post', [
   body('title').notEmpty().withMessage("title is required"),
   body('price').isNumeric().notEmpty().withMessage("Price is required")
], validationError, currentUser, Auth, async(req:Request,res:Response)=>{
   
   const {title, price} = req.body
   

   const ticket =  await Promise.resolve(Ticket.buildTicket({title:title,price:price,created_at:req.currentUser?.id!}))
   await ticket.save()
   new TicketCreation(Nat.client).publisher({
      id: ticket.id,
      title:ticket.title,
      price:ticket.price,
      userId:ticket.created_at,
      version:ticket?.version
   })
   
   return res.status(201).send({ticket})
})

export  {router as PostNewTicket}