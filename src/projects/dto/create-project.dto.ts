import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Type(() => String)
  title: string;
  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  chocolates?: {
    chocolate: string;
    price: number;
  }[];

  @IsOptional()
  addOns?: {
    addOn: string;
    price: number;
  }[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  TwoKindsOfChocolate?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  FourTypesOfChocolate?: boolean;
}
