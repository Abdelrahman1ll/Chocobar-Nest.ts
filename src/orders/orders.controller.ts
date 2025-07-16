import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(createOrderDto, req);
  }

  @Post('paymob')
  // @UseGuards(AuthGuard('jwt'))
  paymob(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createPaymob(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    return this.ordersService.findAll(req);
  }
}
