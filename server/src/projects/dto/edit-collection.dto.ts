import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { Column, Reference } from './create-new-collection.dto';

class EditModifyCollection {
  @ApiProperty({
    description: 'List of operation that will be done to the column',
    type: String,
  })
  @IsArray()
  operations: (
    | 'Rename'
    | 'Type'
    | 'Add Default'
    | 'Remove Default'
    | 'Add Not null'
    | 'Remove Not null'
    | 'FOREIGN'
  )[];

  @ApiProperty({
    description: 'Name of column',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Name to change to',
    type: String,
  })
  @IsString()
  @IsOptional()
  newName?: string;

  @ApiProperty({
    description: 'Datatype',
    type: [String],
  })
  @IsString()
  @IsOptional()
  dataType:
    | 'int2'
    | 'int4'
    | 'int8'
    | 'float4'
    | 'float8'
    | 'numeric'
    | 'json'
    | 'jsonb'
    | 'text'
    | 'varchar'
    | 'uuid'
    | 'date'
    | 'time'
    | 'timetz'
    | 'timestamp'
    | 'timestamptz'
    | 'bool';

  @ApiProperty({
    description: 'Column default value',
    type: [String],
  })
  @IsString()
  @IsOptional()
  defaultValue?: string | null;

  @ApiProperty({
    description: 'Column default value',
    type: [String],
  })
  @IsString()
  type: 'modify';

  @ApiProperty({
    description: 'Column foreign reference',
  })
  @IsOptional()
  references?: Reference;
}

class EditColumnCollection extends Column {
  @ApiProperty({
    description: 'Column default value',
    type: [String],
  })
  @IsString()
  type: 'add' | 'drop';
}

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
  newCollectionName?: string;

  columns?: (EditModifyCollection | EditColumnCollection)[];
}
