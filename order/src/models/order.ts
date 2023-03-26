import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatusEnum } from '@dkpackage/common';
import { TicketDoc } from './ticket';


interface OrderAttrs {
  userId: string;
  status: OrderStatusEnum;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatusEnum;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  buildOrder(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatusEnum),
      default: OrderStatusEnum.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);



orderSchema.statics.buildOrder = (attrs: OrderAttrs) => {
  console.log(attrs,"aattrd")
  return new Order(attrs);
};
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
