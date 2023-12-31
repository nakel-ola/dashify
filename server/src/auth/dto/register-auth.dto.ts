import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'Joe' })
  @MinLength(3)
  firstName: string;

  @ApiProperty({ example: 'Sanders' })
  @MinLength(3)
  lastName: string;

  @ApiProperty({ example: 'wijvouk@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'hd83902kkwkwk' })
  @IsStrongPassword()
  password: string;
}
