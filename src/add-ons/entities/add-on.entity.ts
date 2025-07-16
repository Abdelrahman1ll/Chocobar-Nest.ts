import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddOnDocument = AddOn & Document;

@Schema({ timestamps: true })
export class AddOn {
  @Prop({ required: true })
  name: string;
}

export const AddOnSchema = SchemaFactory.createForClass(AddOn);
