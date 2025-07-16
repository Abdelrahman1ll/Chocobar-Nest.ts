import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBasketDto: CreateBasketDto, @Req() req) {
    return this.basketService.create(createBasketDto, req);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req) {
    return this.basketService.findAll(req);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.basketService.remove(id, req);
  }
}
