import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entity/file.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async create(dto: CreateFileDto) {
    const file = this.fileRepository.create(dto);
    await this.fileRepository.save(file);
    return file;
  }
}
