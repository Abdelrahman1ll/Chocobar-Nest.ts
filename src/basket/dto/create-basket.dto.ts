import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  ValidateNested,
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
  Project: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChocolateEntryDto)
  chocolates?: ChocolateEntryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnEntryDto)
  addOns?: AddOnEntryDto[];
}

export class CreateBasketDto {
  @IsMongoId()
  user: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalBasketPrice?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectInBasketDto)
  Projects: ProjectInBasketDto[];
}
