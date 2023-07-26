import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: CreateUserDto) {
    const token = await this.authService.signUp(dto);
    return { token };
  }
}
