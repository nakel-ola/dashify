import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateProjectDto {
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
}
