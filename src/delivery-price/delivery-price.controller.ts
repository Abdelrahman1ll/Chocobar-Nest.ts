import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { DeliveryPriceService } from './delivery-price.service';
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('delivery-price')
export class DeliveryPriceController {
  constructor(private readonly deliveryPriceService: DeliveryPriceService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createDeliveryPriceDto: CreateDeliveryPriceDto, @Req() req) {
    return this.deliveryPriceService.create(createDeliveryPriceDto, req);
  }

  @Get()
  findAll() {
    return this.deliveryPriceService.findAll();
  }
}
