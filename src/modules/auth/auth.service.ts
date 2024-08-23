import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayload, LoginDto, RegisterDto, VerifyOTPDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CacheService } from '../cache/cache.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isDev } from '../../environment/isDev';
import { Helper } from '../../shared/helpers';
import { CreateEmailDto } from '../../shared/alerts/emails/dto/create-email.dto';
import { AppEvents } from '../../constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signUp(credentials: RegisterDto) {
    const user = await this.usersService.create(credentials);
    this.sendOtp(user.email);
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

  async sendOtp(email: string) {
    const otp = await this.generateOTP([email]);

    // Save to redis
    await this.cacheService.set(email, otp, 600);

    // Send mail
    const createEmailDto: CreateEmailDto = {
      subject: 'Confirm OTP',
      template: 'otp',
      senderEmail: 'CTMS Info <info@lendhive.app>',
      metaData: {
        code: otp,
      },
      receiverEmail: email,
    };
    this.eventEmitter.emit(AppEvents.SEND_EMAIl, createEmailDto);
  }

  async verifyOTP(verifyOTPDto: VerifyOTPDto) {
    const { code, identifier } = verifyOTPDto;
    const otp = await this.cacheService.get(identifier);
    if (otp !== code) {
      throw new UnauthorizedException('Invalid OTP');
    }
    return true;
  }

  async verifyAccount(verifyOTPDto: VerifyOTPDto) {
    const { identifier } = verifyOTPDto;
    await this.verifyOTP(verifyOTPDto);
    await this.cacheService.delete(identifier);
    const user = await this.usersService.findOne(identifier, 'email');
    user.emailVerified = true;
    await user.save();
    const payload: AuthPayload = { id: user.id };
    const token = this.jwtService.sign(payload);
    return {
      user: user.toJSON(),
      token,
    };
  }

  async generateOTP(keys: string[]) {
    const otp = isDev() ? '123456' : Helper.generateToken();
    for (const item of keys) {
      this.cacheService.set(item, otp, 600);
    }
    return otp;
  }
}
