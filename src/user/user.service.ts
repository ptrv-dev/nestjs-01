import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const candidate = await this.userRepository.findOneBy({ email: dto.email });
    if (candidate)
      throw new ConflictException('Specified Email address already taken');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hash });
    await this.userRepository.save(user);

    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async getAll() {
    const users = await this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'createdAt',
        'updatedAt',
      ],
    });
    return users;
  }
}
