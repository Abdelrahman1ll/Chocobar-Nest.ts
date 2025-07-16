import { google, drive_v3 } from 'googleapis';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Readable } from 'stream';
@Injectable()
export class GoogleDriveService {
  private driveClient: drive_v3.Drive;
  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../chocobar-b2f8051c612f.json'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.driveClient = google.drive({ version: 'v3', auth });
  }

  async uploadFileToDrive(file: Express.Multer.File): Promise<string> {
    const bufferStream = Readable.from(file.buffer);
    const response = await this.driveClient.files.create({
      requestBody: {
        name: file?.originalname,
        parents: ['13O0BJKeIyfkjcw4liXI4Tc7tzwwwCFvq'],
        mimeType: file?.mimetype,
      },
      media: {
        mimeType: file?.mimetype,
        body: bufferStream,
      },
      supportsAllDrives: true,
    });

    const fileId = response.data.id;
    if (!fileId) throw new Error('Failed to get file ID from Google Drive.');
    // اجعل الصورة عامة:
    await this.driveClient.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });

    // Return public URL
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
}
