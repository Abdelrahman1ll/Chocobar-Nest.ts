import { IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  name: string;

  @IsString()
  @Length(11, 11)
  phone: string;
}

export class VerifyCodeDto {
  @IsString()
  @Length(11, 11)
  phone: string;

  @IsString()
  otp: string;

  otpExpiration: Date;
}
