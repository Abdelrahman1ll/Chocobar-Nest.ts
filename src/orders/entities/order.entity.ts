import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;
interface ProjectsReference {
  _id?: any;
  Project?: Types.ObjectId;
  price?: number;
  quantity?: number;
  chocolates?: {
    chocolate?: Types.ObjectId;
    price?: number;
  }[];
  addOns?: {
    addOn?: Types.ObjectId;
    price?: number;
  }[];
}
@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
  @Prop({
    type: [
      {
        Project: {
          type: Types.ObjectId,
          ref: 'Project',
        },

        chocolates: [
          {
            chocolate: {
              type: Types.ObjectId,
              ref: 'TypeOfChocolate',
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
          },
        ],
        addOns: [
          {
            addOn: {
              type: Types.ObjectId,
              ref: 'AddOn',
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
          },
        ],
        price: { type: Number },
        quantity: { type: Number },
      },
    ],
  })
  basket: ProjectsReference[];

  @Prop({ type: Number, required: true })
  totalPrice?: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  isPaid?: boolean;

  @Prop({ type: Number, required: true })
  orderNumber: number;

  @Prop({ type: Number, required: true })
  deliveryPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
