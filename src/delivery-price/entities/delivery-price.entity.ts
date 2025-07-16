import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryPriceDocument = DeliveryPrice & Document;

@Schema({ timestamps: true })
export class DeliveryPrice {
  @Prop({ required: true })
  DeliveryPrice: number;
}

export const DeliveryPriceSchema = SchemaFactory.createForClass(DeliveryPrice);
