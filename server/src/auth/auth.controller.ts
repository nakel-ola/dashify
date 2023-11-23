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
  DeleteAccountDto,
  LoginAuthDto,
  MessageDto,
  RegisterAuthDto,
  ResetAuthDto,
  TokensDto,
  UpdateAuthDto,
  UpdatePasswordDto,
  ValidateEmailDto,
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
  @ApiHeader({ name: 'x-access-token', required: true, example: 'Bearer ...' })
  @UseGuards(AuthGuard)
  @Post('/validate-email')
  validateEmail(@Request() req, @Body() args: ValidateEmailDto) {
    return this.authService.validateEmail(req.user.uid, args);
  }

  @ApiOperation({ summary: 'Resend verification email' })
  @ApiHeader({ name: 'x-access-token', required: true, example: 'Bearer ...' })
  @UseGuards(AuthGuard)
  @Post('/resend-email-verification')
  resendEmailVerification(@Request() req) {
    return this.authService.resendEmailVerification(req.user.uid);
  }

  @ApiOperation({ summary: 'Reset Password' })
  @ApiOkResponse({ type: MessageDto })
  @Post('/reset-password')
  resetPassword(@Body() args: ResetAuthDto) {
    return this.authService.resetPassword(args);
  }

  @ApiOperation({ summary: 'Change Password' })
  @ApiOkResponse({ type: MessageDto })
  @Post('/change-password')
  changePassword(@Body() args: ChangePasswordDto) {
    return this.authService.changePassword(args);
  }

  @ApiOperation({ summary: 'Update Password' })
  @ApiHeader({ name: 'x-access-token', required: true, example: 'Bearer ...' })
  @ApiOkResponse({ type: MessageDto })
  @UseGuards(AuthGuard)
  @Post('/update-password')
  updatePassword(@Request() req, @Body() args: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.uid, args);
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiHeader({ name: 'x-access-token', required: true, example: 'Bearer ...' })
  @UseGuards(AuthGuard)
  @Put('/update')
  updateUser(@Request() req, @Body() args: UpdateAuthDto) {
    return this.authService.updateUser(req.user, args);
  }

  @ApiOperation({ summary: 'Get Refresh token' })
  @ApiHeader({ name: 'x-refresh-token', required: true, example: 'Bearer ...' })
  @UseGuards(RefreshAuthGuard)
  @Post('/refresh')
  refresh(@Request() req) {
    return this.authService.getRefreshToken(req.user);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiHeader({ name: 'x-access-token', required: true, example: 'Bearer ...' })
  @UseGuards(AuthGuard)
  @Post('/logout')
  logout() {
    console.log('Logout');
  }

  @ApiOperation({ summary: 'Delete Account' })
  @ApiHeader({ name: 'x-access-token', required: true, example: 'Bearer ...' })
  @UseGuards(AuthGuard)
  @Post('/delete-account')
  deleteAccount(@Request() req, args: DeleteAccountDto) {
    return this.authService.deleteAccount(req.user, args);
  }
}
