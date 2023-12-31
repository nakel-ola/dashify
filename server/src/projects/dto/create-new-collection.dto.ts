import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateNewCollectionDto {
  @ApiProperty({
    description: 'Name of collection',
    type: String,
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'If the database is not mongodb required',
    type: [String],
  })
  @IsString()
  @IsOptional()
  column?: string[];
}
