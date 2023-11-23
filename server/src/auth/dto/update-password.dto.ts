import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'Password00@' })
  @IsStrongPassword()
  currentPassword: string;

  @ApiProperty({ example: 'Password21@' })
  @IsStrongPassword()
  newPassword: string;
}
