import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPort,
  IsString,
  MinLength,
} from 'class-validator';

enum DatabaseType {
  MONGODB = 'mongodb',
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  COCKROACHDB = 'cockroachdb',
}

class DatabaseConfig {
  @ApiProperty({
    description: 'Database name',
    example: 'defaultdb',
    type: String,
  })
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Database host',
    example: 'somber-mink-9626.8nj.cockroachlabs.cloud',
    type: String,
  })
  @MinLength(3)
  host: string;

  @ApiProperty({
    description: 'Database port',
    example: 26257,
    type: Number,
  })
  @IsPort()
  port: number;

  @ApiProperty({
    description: 'Is database ssl',
    example: false,
    type: Boolean,
  })
  @IsPort()
  ssl: boolean;

  @ApiProperty({
    description: 'Database username',
    example: 'olamilekan',
    type: String,
  })
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Database password',
    example: 'JtAiFv3UkuC4eAvyn6Kqfg',
    type: String,
  })
  @MinLength(8)
  password: string;
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project id',
    example: 'finance-tracker-78493',
  })
  @IsString()
  @MinLength(8)
  projectId: string;

  @ApiProperty({
    description: 'Project logo',
    example: null,
    type: String || null,
  })
  @IsOptional()
  logo: string | null;

  @ApiProperty({
    description: 'Project name',
    example: 'Finance Tracker',
    type: String,
  })
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Database: cockroachdb, mongodb, mysql, postgres',
    example: 'cockroachdb',
    type: String,
  })
  @IsEnum(DatabaseType, {
    message:
      'Invalid database. Must be either cockroachdb, mongodb, mysql, postgres.',
  })
  database: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';

  @ApiProperty({ description: 'Database connection details' })
  databaseConfig: DatabaseConfig;
}
