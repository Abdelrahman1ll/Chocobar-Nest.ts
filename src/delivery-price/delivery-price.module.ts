import { Module } from '@nestjs/common';
import { DeliveryPriceService } from './delivery-price.service';
import { DeliveryPriceController } from './delivery-price.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeliveryPrice,
  DeliveryPriceSchema,
} from './entities/delivery-price.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: DeliveryPrice.name, schema: DeliveryPriceSchema },
    ]),
  ],
  controllers: [DeliveryPriceController],
  providers: [DeliveryPriceService],
})
export class DeliveryPriceModule {}
