import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TemporaryLoginDocument = TemporaryLogin & Document;

@Schema({ timestamps: true })
export class TemporaryLogin {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  otpExpiration: Date;
}

export const TemporaryLoginSchema =
  SchemaFactory.createForClass(TemporaryLogin);
