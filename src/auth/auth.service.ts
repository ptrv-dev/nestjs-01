import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<string> {
    const user = await this.userService.create(dto);
    const token = await this.generateToken(user);

    return token;
  }

  async signIn(dto: SignInDto): Promise<string> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = await this.generateToken(user);
    return token;
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
