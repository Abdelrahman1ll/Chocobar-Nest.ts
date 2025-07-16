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
import { AddOnsService } from './add-ons.service';
import { CreateAddOnDto } from './dto/create-add-on.dto';
import { UpdateAddOnDto } from './dto/update-add-on.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('add-ons')
export class AddOnsController {
  constructor(private readonly addOnsService: AddOnsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAddOnDto: CreateAddOnDto, @Req() req) {
    return this.addOnsService.create(createAddOnDto, req);
  }

  @Get()
  findAll() {
    return this.addOnsService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateAddOnDto: UpdateAddOnDto,
    @Req() req,
  ) {
    return this.addOnsService.update(id, updateAddOnDto, req);
  }
}
