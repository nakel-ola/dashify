import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class Reference {
  @ApiProperty({
    description: 'Reference table name ',
    type: [String],
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'Reference column name',
    type: [String],
  })
  @IsString()
  fieldName: string;

  @ApiProperty({
    description: 'On Update can either be Cascade, Restrict',
    type: [String],
  })
  @IsString()
  @IsOptional()
  onUpdate?: 'Cascade' | 'Restrict' | null;

  @ApiProperty({
    description:
      'On Delete can either be Cascade, Restrict, Set default, Set NULL',
    type: [String],
  })
  @IsString()
  @IsOptional()
  onDelete?: 'Cascade' | 'Restrict' | 'Set default' | 'Set NULL' | null;
}

export class Column {
  @ApiProperty({
    description: 'Column name',
    type: [String],
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Datatype',
    type: [String],
  })
  @IsString()
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
    description: 'If column is primary',
    type: [Boolean],
  })
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty({
    description: 'If column is nullable',
    type: [Boolean],
  })
  @IsBoolean()
  isNullable: boolean;

  @ApiProperty({
    description: 'If column is unique',
    type: [Boolean],
  })
  @IsBoolean()
  isUnique: boolean;

  @ApiProperty({
    description: 'If column is an array',
    type: [Boolean],
  })
  @IsBoolean()
  isArray: boolean;

  @ApiProperty({
    description: 'is identify',
    type: [Boolean],
  })
  @IsBoolean()
  isIdentify: boolean;

  @ApiProperty({
    description: 'Column default value',
    type: [String],
  })
  @IsString()
  @IsOptional()
  defaultValue?: string | null;

  @ApiProperty({
    description: 'Column foreign reference',
  })
  @IsOptional()
  references?: Reference;
}

export class CreateNewCollectionDto {
  @ApiProperty({
    description: 'Name of collection',
    type: String,
  })
  @IsString()
  collectionName: string;

  @ApiProperty({
    description: 'If the database is not mongodb then this is required',
    type: [String],
  })
  @IsOptional()
  columns?: Column[];
}
