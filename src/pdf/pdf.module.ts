import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/entities/auth.entity';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
