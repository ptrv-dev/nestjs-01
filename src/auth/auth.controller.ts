import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    const token = await this.authService.signUp(dto);
    return { token };
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    const token = await this.authService.signIn(dto);
    return { token };
  }
}
