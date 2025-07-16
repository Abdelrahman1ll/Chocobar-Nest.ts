import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfChocolateDto } from './create-type-of-chocolate.dto';

export class UpdateTypeOfChocolateDto extends PartialType(
  CreateTypeOfChocolateDto,
) {}
