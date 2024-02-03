import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'util';

@Injectable()
export class UploadService {
  private readonly storage = new Storage({
    credentials: JSON.parse(
      this.configService.get('GOOGLE_CLOUD_CREDENTIALS') || '{}',
    ),
  });

  constructor(private configService: ConfigService) {}

  upload(
    filename: string,
    buffer: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    // console.log(filename, buffer, metadata);
    return new Promise<{ url: string }>((resolve, reject) => {
      const bucket = this.storage.bucket(
        this.configService.get('STORAGE_BUCKET_NAME'),
      );

      const blob = bucket.file(filename);

      const object = metadata.reduce(
        (obj, item) => Object.assign(obj, item),
        {},
      );

      const file = bucket.file(filename);

      const stream = file.createWriteStream();

      stream.on('error', (err: any) => {
        console.log('UploadError:', err);
        reject(err);
      });

      stream.on('finish', async () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        try {
          await bucket.file(filename).makePublic();
        } catch {
          console.log(
            `Uploaded the file successfully: ${filename}, but public access is denied!`,
          );
        }

        await file.setMetadata({
          metadata: object,
        });

        resolve({ url: publicUrl });
      });
      stream.end(buffer);
    });
  }
}
