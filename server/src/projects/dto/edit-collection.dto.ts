import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class EditCollectionDto {
  @ApiProperty({
    description: 'Name of collection',
    type: String,
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'Name to change to',
    type: String,
  })
  @IsString()
  @IsOptional()
  newCollectionName: string;
}
