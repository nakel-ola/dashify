import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class AcceptMemberInviteDto {
  @ApiProperty({ example: '73jeje-jejeje' })
  @MinLength(8)
  token: string;
}
