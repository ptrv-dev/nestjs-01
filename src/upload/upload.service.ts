import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entity/file.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateFileDto) {
    const file = this.fileRepository.create(dto);
    await this.fileRepository.save(file);
    return file;
  }

  async createMany(dto: Array<CreateFileDto>) {
    const transaction = this.dataSource.createQueryRunner();

    await transaction.connect();
    await transaction.startTransaction();

    const result: File[] = [];

    try {
      for await (const data of dto) {
        const file = this.fileRepository.create(data);
        await transaction.manager.save(file);
        result.push(file);
      }
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
    } finally {
      await transaction.release();
    }

    return result;
  }
}
