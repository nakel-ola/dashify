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
import {
  ChangePasswordDto,
  LoginAuthDto,
  MessageDto,
  RegisterAuthDto,
  ResetAuthDto,
  TokensDto,
  UpdateAuthDto,
  ValidateEmailDto,
  ValidateResetTokenDto,
} from './dto';
import { AuthGuard } from './guard/auth.guard';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ type: MessageDto })
  @Post('/register')
  register(@Body() args: RegisterAuthDto) {
    return this.authService.register(args);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: TokensDto })
  @Post('/login')
  login(@Body() args: LoginAuthDto) {
    return this.authService.login(args);
  }

  @ApiOperation({ summary: 'Validate email address' })
  @ApiHeader({
    name: 'x-access-token',
    required: true,
    example: 'Bearer .....',
  })
  @UseGuards(AuthGuard)
  @Put('/validate-email')
  validateEmail(@Request() req, @Body() args: ValidateEmailDto) {
    return this.authService.validateEmail(req.user.uid, args);
  }

  @ApiOperation({ summary: 'Reset Password' })
  @ApiOkResponse({ type: MessageDto })
  @Post('/reset-password')
  resetPassword(@Body() args: ResetAuthDto) {
    return this.authService.resetPassword(args);
  }

  @ApiOperation({ summary: 'Validate reset Token' })
  @ApiOkResponse({ type: MessageDto })
  @Post('/validate-reset-token')
  validateResetEmailToken(@Body() args: ValidateResetTokenDto) {
    return this.authService.validateResetToken(args);
  }

  @ApiOperation({ summary: 'Change Password' })
  @ApiOkResponse({ type: MessageDto })
  @Post('/change-password')
  changePassword(@Body() args: ChangePasswordDto) {
    return this.authService.changePassword(args);
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiHeader({
    name: 'x-access-token',
    required: true,
    example: 'Bearer .....',
  })
  @UseGuards(AuthGuard)
  @Put('/update')
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
