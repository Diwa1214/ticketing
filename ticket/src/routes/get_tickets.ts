import { Auth, currentUser, validationError } from "@dkpackage/common"
import express from "express"
import { body } from "express-validator"
import { Request,Response } from "express"
import { Ticket } from "../model/Ticket"

const router = express.Router()

router.get('/api/ticket/all', currentUser, Auth, async(req:Request,res:Response)=>{

   const tickets =  await Promise.resolve(Ticket.find().exec())

   return res.status(200).send({'tickets':tickets})
})

export  {router as GetTicket}