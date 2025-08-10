import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { User, UserDocument } from 'src/auth/entities/auth.entity';

@Injectable()
export class PdfService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async generatePdf() {
    const users = await this.userModel.find().exec();
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>قائمة العملاء</title>
<style>
  body { font-family: Arial, sans-serif; background: #EFD3A8; margin: 0; padding: 20px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 900px; margin: auto; }
  .card {
    background: #f3dfc4;
    color: #372113;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #a15d36;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
  }
  .name { font-weight: 600; font-size: 16px; margin: 0; }
  .phone { font-size: 14px; color: #5a3925; margin: 0; }
</style>
</head>
<body>
<h2 style="text-align:center;">قائمة العملاء</h2>
<div class="grid">
  ${users
    .map(
      (u) => `
    <div class="card">
      <div class="avatar">${u.name?.charAt(0) || ''}</div>
      <div>
        <p class="name">${u.name || ''}</p>
        <p class="phone">${u.phone || ''}</p>
      </div>
    </div>
  `,
    )
    .join('')}
</div>
</body>
</html>
`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(__dirname, 'users.pdf');
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

    await browser.close();
    return pdfPath;
  }
}
