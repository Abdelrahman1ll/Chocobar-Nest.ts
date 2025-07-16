import { Types } from 'mongoose';
import {
  IsMongoId,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
export class ChocolateEntryDto {
  @IsMongoId()
  chocolate?: string;

  @IsNumber()
  price?: number;
}

export class AddOnEntryDto {
  @IsMongoId()
  addOn?: string;

  @IsNumber()
  price?: number;
}
export class ProjectInBasketDto {
  @IsMongoId()
  Project?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  quantity?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChocolateEntryDto)
  chocolates?: ChocolateEntryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnEntryDto)
  addOns?: AddOnEntryDto[];
}
export class CreateOrderDto {
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  user?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectInBasketDto)
  basket?: ProjectInBasketDto[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalPrice?: number;

  @IsString()
  address: string;

  @IsString()
  @Length(11, 11)
  phone: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsNumber()
  orderNumber?: number;

  @IsOptional()
  @IsNumber()
  deliveryPrice?: number;
}
