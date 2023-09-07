import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto, TokensDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guard/auth.guard';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ type: TokensDto })
  @Post('/register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: TokensDto })
  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiHeader({
    name: 'x-access-token',
    required: true,
    example: 'Bearer .....',
  })
  @UseGuards(AuthGuard)
  @Put('update')
  updateUser(@Request() req, @Body() args: UpdateAuthDto) {
    return this.authService.updateUser(req.user, args);
  }

  @ApiOperation({ summary: 'Get Refresh token' })
  @ApiHeader({
    name: 'x-refresh-token',
    required: true,
    example: 'Bearer .....',
  })
  @UseGuards(RefreshAuthGuard)
  @Post('/refresh')
  refresh(@Request() req) {
    console.log(req.user);
    return this.authService.getRefreshToken(req.user);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiHeader({
    name: 'x-access-token',
    required: true,
    example: 'Bearer .....',
  })
  @UseGuards(AuthGuard)
  @Post('/logout')
  logout() {
    console.log('Logout');
  }
}
