import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsStrongPassword,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'lakkyt2003@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '73jeje-jejeje' })
  @MinLength(8)
  token: string;

  @ApiProperty({ example: 'Password21@' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'Motunrayo21' })
  @IsStrongPassword()
  @Equals('password')
  confirmPassword: string;
}
