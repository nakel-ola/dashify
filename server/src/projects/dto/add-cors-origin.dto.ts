import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddCorsOriginDto {
  @ApiProperty({
    description: 'Url',
    type: String,
  })
  @IsString()
  origin: string;
}
