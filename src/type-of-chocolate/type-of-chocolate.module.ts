import { Module } from '@nestjs/common';
import { TypeOfChocolateService } from './type-of-chocolate.service';
import { TypeOfChocolateController } from './type-of-chocolate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TypeOfChocolate,
  TypeOfChocolateScheme,
} from './entities/type-of-chocolate.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TypeOfChocolate.name, schema: TypeOfChocolateScheme },
    ]),
    AuthModule,
  ],
  controllers: [TypeOfChocolateController],
  providers: [TypeOfChocolateService],
  exports: [TypeOfChocolateService],
})
export class TypeOfChocolateModule {}
