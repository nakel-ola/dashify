import { ApiResponseProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}
