import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDefined } from 'class-validator';

class Document {
  @ApiProperty({
    description: 'Column name',
    type: [String],
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Column value',
    type: [String],
  })
  @IsDefined()
  value: any;
}
export class AddNewDocumentDto {
  @ApiProperty({
    description: 'Name of collection',
    type: String,
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'document you want to add ',
    type: [String],
  })
  @IsOptional()
  documents: Document[];
}
