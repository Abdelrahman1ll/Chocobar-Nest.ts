import { IsNumber } from 'class-validator';

export class CreateDeliveryPriceDto {
  @IsNumber()
  DeliveryPrice: number;
}
