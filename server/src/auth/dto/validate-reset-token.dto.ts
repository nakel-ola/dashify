import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class ValidateResetTokenDto {
  @ApiProperty({ example: 'lakkyt2003@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '73jeje-jejeje' })
  @MinLength(8)
  token: string;
}
