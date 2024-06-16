import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, MinLength } from 'class-validator';

enum PROVIDER {
  GOOGLE = 'GOOGLE',
}
export class SigninAuthDto {
  @ApiProperty({
    description: 'Unique email ',
    example: 'yourname@efortlex.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User given name',
    example: 'John',
  })
  @MinLength(3)
  firstName: string;

  @ApiProperty({
    description: 'User family name',
    example: 'Doe',
  })
  @MinLength(3)
  lastName: string;

  @ApiProperty({
    description: 'Which provider are you signin with "GOOGLE" or "APPLE"',
    example: 'GOOGLE',
  })
  @IsEnum(PROVIDER)
  provider: 'GOOGLE';
}
