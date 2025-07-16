import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: 0 }) // نستخدمه لمتابعة إصدار التوكن
  tokenVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
