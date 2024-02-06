import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddNewDocumentsDto {
  @ApiProperty({
    description: 'Name of collection',
    type: String,
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'field to add values ',
    type: [Array],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  fieldNames: string[];

  @ApiProperty({
    description: 'document you want to add ',
    type: [Array],
  })
  @ArrayNotEmpty()
  values: any[][];
}
