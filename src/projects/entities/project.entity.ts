import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;
interface ChocolateReference {
  chocolate: Types.ObjectId;
  price: number;
}

interface AddOnsReference {
  addOn: Types.ObjectId;
  price: number;
}
@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: [
      {
        chocolate: {
          type: Types.ObjectId,
          ref: 'TypeOfChocolate',
        },
        price: { type: Number },
      },
    ],
  })
  chocolates: ChocolateReference[];

  @Prop({
    type: [
      {
        addOn: {
          type: Types.ObjectId,
          ref: 'AddOn',
        },
        price: { type: Number },
      },
    ],
  })
  addOns: AddOnsReference[];

  @Prop({ default: false })
  TwoKindsOfChocolate: boolean;

  @Prop({ default: false })
  FourTypesOfChocolate: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
