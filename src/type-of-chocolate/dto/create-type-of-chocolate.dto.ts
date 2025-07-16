import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeOfChocolateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
