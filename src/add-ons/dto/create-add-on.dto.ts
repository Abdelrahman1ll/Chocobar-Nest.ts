import { IsString } from 'class-validator';

export class CreateAddOnDto {
  @IsString()
  name: string;
}
