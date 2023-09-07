import { IsEnum, IsOptional, IsUrl, MinLength } from 'class-validator';
import { Gender } from '../../users/entities/user.entity';

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

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}
