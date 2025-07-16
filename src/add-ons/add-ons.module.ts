import { Module } from '@nestjs/common';
import { AddOnsService } from './add-ons.service';
import { AddOnsController } from './add-ons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddOn, AddOnSchema } from './entities/add-on.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: AddOn.name, schema: AddOnSchema }]),
  ],
  controllers: [AddOnsController],
  providers: [AddOnsService],
  exports: [AddOnsService],
})
export class AddOnsModule {}
