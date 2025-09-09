import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // يحذف أي property مش موجودة في DTO
      // forbidNonWhitelisted: true, // يرمي Error لو لقى property مش متعرفة
      transform: true, // أهم شيء: يحوّل النصوص (من form-data) لأرقام و Boolean تلقائيًا
    }),
  );

  app.use(cookieParser());

  
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
