import { IsOptional, IsUrl, MinLength } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsUrl()
  photoUrl: string;

  @IsOptional()
  @MinLength(3)
  firstName: string;

  @IsOptional()
  @MinLength(3)
  lastName: string;
}
