import { Auth, BadRequest, currentUser, validationError } from "@dkpackage/common"
import express from "express"
import { body } from "express-validator"
import { Request,Response } from "express"
import { Ticket } from "../model/Ticket"
import { TicketUpdate } from "../../nats/events/TicketUpdation"
import { Nat } from "../../nats/config"

const router = express.Router()

router.put('/api/ticket/update/:id', [
   body('title').notEmpty().withMessage("title is required"),
   body('price').isNumeric().notEmpty().withMessage("Price is required")
], validationError, currentUser, Auth, async(req:Request,res:Response)=>{
   
   const {title, price} = req.body
   const id = req.params.id


   const findExistingTicket = await Promise.resolve(Ticket.findById(id))

   if(!findExistingTicket){
       throw  new BadRequest('This ticket is does not exist')
   }

   if(findExistingTicket.orderId !== undefined){
      throw  new BadRequest('This ticket is already is reserved')
   }

   else{
      if(findExistingTicket.created_at == req.currentUser?.id){
        const updateTicket = await Promise.resolve(findExistingTicket.set({
            title:title,
            price:price
        }))
        
        new TicketUpdate(Nat.client).publisher({
          id: updateTicket.id,
          title:updateTicket.title,
          price:updateTicket.price,
          userId:updateTicket.created_at,
          version:updateTicket?.version
        })
        return res.status(201).send({updateTicket})
      }
      else{
       throw  new BadRequest('Other user cannot update the ticket')
      }

   }

//    const response =  await Promise.resolve(Ticket.buildTicket({title:title,price:price}))

  
})

export  {router as UpdateTicket}