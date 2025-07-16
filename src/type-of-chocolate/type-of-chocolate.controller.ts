import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TypeOfChocolateService } from './type-of-chocolate.service';
import { CreateTypeOfChocolateDto } from './dto/create-type-of-chocolate.dto';
import { UpdateTypeOfChocolateDto } from './dto/update-type-of-chocolate.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('type-of-chocolate')
export class TypeOfChocolateController {
  constructor(
    private readonly typeOfChocolateService: TypeOfChocolateService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createTypeOfChocolateDto: CreateTypeOfChocolateDto,
    @Req() req,
  ) {
    return this.typeOfChocolateService.create(createTypeOfChocolateDto, req);
  }

  @Get()
  findAll() {
    return this.typeOfChocolateService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateTypeOfChocolateDto: UpdateTypeOfChocolateDto,
    @Req() req,
  ) {
    return this.typeOfChocolateService.update(
      id,
      updateTypeOfChocolateDto,
      req,
    );
  }
}
