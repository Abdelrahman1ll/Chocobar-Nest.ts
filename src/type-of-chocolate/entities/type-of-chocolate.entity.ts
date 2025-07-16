import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TypeOfChocolateDocument = TypeOfChocolate & Document;

@Schema({ timestamps: true })
export class TypeOfChocolate {
  @Prop({ required: true, unique: true })
  name: string;
}

export const TypeOfChocolateScheme =
  SchemaFactory.createForClass(TypeOfChocolate);
