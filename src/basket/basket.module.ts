import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Basket, BasketSchema } from './entities/basket.entity';
import { ProjectsModule } from 'src/projects/projects.module';
@Module({
  imports: [
    ProjectsModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Basket.name,
        schema: BasketSchema,
      },
    ]),
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService, MongooseModule],
})
export class BasketModule {}
