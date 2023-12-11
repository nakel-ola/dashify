import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTokenDto {
  @ApiProperty({
    description: 'Name the token',
    type: String,
  })
  @IsString()
  name: string;
}
