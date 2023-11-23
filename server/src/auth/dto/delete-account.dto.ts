import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({ example: 'Password21@' })
  @IsStrongPassword()
  password: string;
}
