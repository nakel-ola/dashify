import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPort,
  IsString,
  MinLength,
} from 'class-validator';

// mongodb+srv://Olamilekan:0cWd7OZvKSHVV5qh@cluster0.81q6hhf.mongodb.net/farmart?retryWrites=true&w=majority
// 27017

/**
 * CockroachDB
 * url: postgresql://olamilekan:JtAiFv3UkuC4eAvyn6Kqfg@somber-mink-9626.8nj.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
 * databaseName: defaultdb
 * port: 26257
 * host: somber-mink-9626.8nj.cockroachlabs.cloud
 * username: olamilekan
 * password: JtAiFv3UkuC4eAvyn6Kqfg
 */

/**
 * Postgres
 * url: postgres://olamilekan:Hw5X2jhlSZxOzIIy8uXvfbUH7l0Klapi@dpg-cjauur0cfp5c7397sm2g-a.oregon-postgres.render.com/dashify
 * databaseName: dashify
 * port: 5432
 * host: dpg-cjauur0cfp5c7397sm2g-a.oregon-postgres.render.com
 * username: olamilekan
 * password: Hw5X2jhlSZxOzIIy8uXvfbUH7l0Klapi
 */

/**
 * Mysql
 * url: mysql://u5cz4dvyp1pjysbp:oUghgV5BtAAcPpUh2sMu@beib9ilvdnnxsl5zarb6-mysql.services.clever-cloud.com:3306/beib9ilvdnnxsl5zarb6
 * databaseName: beib9ilvdnnxsl5zarb6
 * port: 3306
 * host: beib9ilvdnnxsl5zarb6-mysql.services.clever-cloud.com
 * username: u5cz4dvyp1pjysbp
 * password: oUghgV5BtAAcPpUh2sMu
 */

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
