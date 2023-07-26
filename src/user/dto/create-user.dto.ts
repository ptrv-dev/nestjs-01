import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 64)
  firstName: string;

  @IsString()
  @Length(2, 64)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 64)
  password: string;
}
