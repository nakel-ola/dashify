import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ValidateMemberInviteDto {
  @ApiProperty({ example: '73jeje-jejeje' })
  @MinLength(8)
  token: string;
}
