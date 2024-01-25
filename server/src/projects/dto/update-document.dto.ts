import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

class Where {
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
  @IsString()
  value: string;
}

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Name of collection',
    type: String,
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'query',
    type: [String],
  })
  @IsOptional()
  where: Where;

  @ApiProperty({
    description: 'document you want to update ',
    type: [String],
  })
  @IsOptional()
  set: Where[];
}
