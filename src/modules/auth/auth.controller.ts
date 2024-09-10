import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { resolveResponse, sendObjectResponse } from '../../shared/resolvers';
import { User } from '../users/entities/user.entity';
import { GenerateOTPDto, LoginDto, RegisterDto, RequestResetPasswordDto, ResetPasswordDto, VerifyOTPDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from '../../shared/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Public()
  create(@Body() registerDto: RegisterDto) {
    return resolveResponse(this.authService.signUp(registerDto), 'Account Created');
  }

  @Post('sign-in')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return resolveResponse(this.authService.signIn(loginDto), 'Login Success');
  }

  @ApiBearerAuth()
  @Get('me')
  validateToken(@CurrentUser() user: User) {
    return sendObjectResponse(user, 'Token is valid');
  }

  @Post('verify-otp')
  async verifyOTP(@Body() verifyOTPDto: VerifyOTPDto) {
    return resolveResponse(this.authService.verifyOTP(verifyOTPDto));
  }

  @Post('verify-account')
  async verifyAccount(@Body() verifyAccountDto: VerifyOTPDto) {
    return resolveResponse(this.authService.verifyAccount(verifyAccountDto));
  }

  @Post('send-otp')
  async sendOtp(@Body() dto: GenerateOTPDto) {
    return resolveResponse(this.authService.sendOtp(dto.identifier));
  }

  @Post('request-reset-password')
  @Public()
  async requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    return resolveResponse(this.authService.requestResetPassword(requestResetPasswordDto));
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return resolveResponse(this.authService.resetPassword(resetPasswordDto), 'Reset Password');
  }

}
