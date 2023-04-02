import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

interface TicketAttr {
     title: string
     price: number,
     created_at: string
}

interface TicketDoc extends mongoose.Document {
    title: string
    price: number,
    created_at:string,
    version:number,
    orderId:string
}

interface TicketModal  extends mongoose.Model<TicketDoc> {
    buildTicket(att: TicketAttr):TicketDoc
}



const TicketSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },

    price:{
        type: Number,
        required: true
    },
    created_at:{
         type: String,
         required: true
    },
    orderId:{
        type:String,
        default:undefined
    }

},{
    toJSON:{
        versionKey:false,
        transform(doc, ret, options) {
          ret.id = ret._id
          delete ret._id  
        },
    }
})

TicketSchema.plugin(updateIfCurrentPlugin)
TicketSchema.set("versionKey","version")

TicketSchema.statics.buildTicket = (att:TicketAttr)=>{
  return  new Ticket(att)
}

const Ticket  = mongoose.model<TicketDoc,TicketModal>('ticket',TicketSchema)


export {Ticket}