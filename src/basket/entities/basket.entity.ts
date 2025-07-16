import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BasketDocument = Basket & Document;
interface ProjectsReference {
  _id: any;
  Project: Types.ObjectId;
  price: number;
  quantity: number;
  chocolates: {
    chocolate: Types.ObjectId;
    price: number;
  }[];
  addOns: {
    addOn: Types.ObjectId;
    price: number;
  }[];
}
@Schema({ timestamps: true })
export class Basket {
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
  Projects: ProjectsReference[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  totalBasketPrice: number;
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
