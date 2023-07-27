import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get()
  async getAll() {
    const files = await this.uploadService.getAll();
    return files;
  }

  @Get(':name')
  async getFileByName(@Param('name') name: string, @Res() res: Response) {
    const stream = createReadStream(join(process.cwd(), 'uploads', name));
    stream.pipe(res);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('single')
  async upload(@UploadedFile('file') file: Express.Multer.File) {
    if (!file) throw new BadRequestException();
    const uploaded = await this.uploadService.create(file);
    return uploaded;
  }

  @UseInterceptors(
    FilesInterceptor('file', 50, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('many')
  async uploadMany(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files) throw new BadRequestException();
    const uploaded = await this.uploadService.createMany(files);
    return uploaded;
  }
}
