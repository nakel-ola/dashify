import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'lakkyt2003@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '73jeje-jejeje' })
  @Length(6)
  token: string;

  @ApiProperty({ example: 'Password21@' })
  @IsStrongPassword()
  password: string;
}
