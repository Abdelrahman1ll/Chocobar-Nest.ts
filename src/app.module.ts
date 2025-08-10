import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { BasketModule } from './basket/basket.module';
import { DeliveryPriceModule } from './delivery-price/delivery-price.module';
import { TypeOfChocolateModule } from './type-of-chocolate/type-of-chocolate.module';
import { AddOnsModule } from './add-ons/add-ons.module';
import { ProjectsModule } from './projects/projects.module';
import { OrdersModule } from './orders/orders.module';
import { PdfModule } from './pdf/pdf.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    AuthModule,
    GoogleDriveModule,
    BasketModule,
    DeliveryPriceModule,
    TypeOfChocolateModule,
    AddOnsModule,
    ProjectsModule,
    OrdersModule,
    PdfModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
