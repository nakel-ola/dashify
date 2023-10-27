import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'lakkyt2003@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Motunrayo21' })
  @IsString()
  @IsStrongPassword()
  password: string;
}
