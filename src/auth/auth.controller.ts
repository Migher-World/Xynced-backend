import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { resolveResponse } from '../shared/resolvers';
import { User } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async create(@Body() registerDto: RegisterDto) {
    return resolveResponse(
      this.authService.register(registerDto),
      'Account Created',
    );
  }

  @Post('sign-in')
  async login(@Body() loginDto: LoginDto) {
    return resolveResponse(this.authService.login(loginDto), 'Login Success');
  }

  @UseGuards(AuthGuard)
  @Get('me')
  validateToken(@CurrentUser() user: User) {
    return resolveResponse(user, 'Token is valid');
  }
}
