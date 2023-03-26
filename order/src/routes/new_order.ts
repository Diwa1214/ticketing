import { BadRequest, OrderStatusEnum, validationError,currentUser,Auth } from "@dkpackage/common";
import express,{Request,Response} from "express"
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { Nat } from "../nats/config";
import { OrderCreatedPublisher } from "../nats/events/publishers/order-created-publisher";

const router = express.Router()

router.post('/api/order/create',
[
   body('ticketId')
     .not()
     .isEmpty()
    //  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
     .withMessage('TicketId must be provided'),
 ],
 validationError,
 currentUser, Auth,
 async(req:Request,res:Response)=>{
    try{
      const { ticketId } = req.body;
      const EXPIRATION_WINDOW_SECONDS = 2 * 60;
   
      // Find the ticket the user is trying to order in the database
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
         throw new BadRequest("ticket not found");
      }
   
      // Make sure that this ticket is not already reserved
      const isReserved = await ticket.isReserved();
      console.log(isReserved,req.currentUser,"isreserver")
      console.log(req.currentUser?.id,"isreserver")

      if (isReserved) {
        throw new BadRequest('Ticket is already reserved');
      }
   
      // Calculate an expiration date for this order
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
   
      console.log("getting")
   
      // Build the order and save it to the database
      const order = await Order.buildOrder({
        userId: req.currentUser!.id,
        status: OrderStatusEnum.Created,
        expiresAt: expiration,
        ticket,
      });
      console.log(order,"order");
      
      await order.save();
   
      // Publish an event saying that an order was created
      new OrderCreatedPublisher(Nat.client).publisher({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      });
   
   
     //  new PaymentCreatePublisher(Nat.client).publisher({
     //     id:order?.id,
     //     ticket:{
     //       price:ticket?.price
     //     }
     //  })
   
     return res.status(201).send(order);
    }
    catch(err){
       console.log(err)
    }
})

export {router as CreateNewOrderRouter}