import { IsEmail, IsString, MinLength, Length } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
