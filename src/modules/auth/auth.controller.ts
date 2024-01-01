import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { resolveResponse, sendObjectResponse } from '../../shared/resolvers';
import { User } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';
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
}
