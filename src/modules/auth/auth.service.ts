import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayload, LoginDto, RegisterDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(credentials: RegisterDto) {
    const user = await this.usersService.create(credentials);
    const payload: AuthPayload = { id: user.id };
    const token = this.jwtService.sign(payload);
    return { user: user.toJSON(), token };
  }

  async signIn(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.usersService.findOne(email, 'email');
      if (user && (await user.comparePassword(password))) {
        const payload: AuthPayload = { id: user.id };
        const token = this.jwtService.sign(payload);
        return { user: user.toJSON(), token };
      }
      throw new UnauthorizedException('Invalid Credentials');
    } catch (error) {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}
