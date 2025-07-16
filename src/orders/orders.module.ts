import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { BasketModule } from 'src/basket/basket.module';
import { DeliveryPriceModule } from 'src/delivery-price/delivery-price.module';
import { BasketSchema, Basket } from 'src/basket/entities/basket.entity';
import {
  DeliveryPriceSchema,
  DeliveryPrice,
} from 'src/delivery-price/entities/delivery-price.entity';
import { HttpModule } from '@nestjs/axios';
import { TypeOfChocolateModule } from 'src/type-of-chocolate/type-of-chocolate.module';
import { AddOnsModule } from 'src/add-ons/add-ons.module';
@Module({
  imports: [
    AddOnsModule,
    TypeOfChocolateModule,
    DeliveryPriceModule,
    BasketModule,
    AuthModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      { name: Basket.name, schema: BasketSchema },
      { name: DeliveryPrice.name, schema: DeliveryPriceSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
