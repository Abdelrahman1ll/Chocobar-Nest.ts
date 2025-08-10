/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getPdf(@Res() res: Response, @Req() req: any) {
    if (req?.user?.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const filePath = await this.pdfService.generatePdf();
    const fileStream = fs.createReadStream(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    fileStream.pipe(res);
  }
}
