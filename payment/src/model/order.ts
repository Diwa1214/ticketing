import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatusEnum } from '@dkpackage/common';


interface OrderAttrs {
  id:string; 
  userId: string;
  status: OrderStatusEnum;
  ticketPrice: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatusEnum;
  ticketPrice: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
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
    },
    ticketPrice: {
      type: Number,
      required:true
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
      _id:attrs?.id,
      ticketPrice:attrs?.ticketPrice,
      status:attrs?.status,
      userId:attrs?.userId
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
