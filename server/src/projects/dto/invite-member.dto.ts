import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({
    description: 'Email',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Permission can be editor, viewer and administrator',
    type: String,
  })
  @IsString()
  role: 'administrator' | 'editor' | 'viewer';
}
