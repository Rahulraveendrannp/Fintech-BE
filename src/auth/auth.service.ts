import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';
import { Otp } from './otp.schema';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, SendOtpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private sign(user: User) {
    const payload = { sub: user._id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  /** Generate a 6-digit OTP, save it, send email */
  async sendOtp(dto: SendOtpDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) throw new ConflictException('This email is already registered');

    // Remove any existing OTP for this email
    await this.otpModel.deleteMany({ email: dto.email.toLowerCase() });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpModel.create({ email: dto.email.toLowerCase(), code });

    await this.emailService.sendOtpEmail(dto.email, code, dto.name);

    return { message: `OTP sent to ${dto.email}` };
  }

  /** Create account — verifies OTP first */
  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) throw new ConflictException('Email already in use');

    const record = await this.otpModel.findOne({ email: dto.email.toLowerCase() });
    if (!record) throw new BadRequestException('OTP expired or not found. Please request a new one.');
    if (record.code !== dto.otp) throw new BadRequestException('Invalid OTP. Please try again.');

    await this.otpModel.deleteMany({ email: dto.email.toLowerCase() });

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashed,
    });
    return this.sign(created);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid email or password');

    return this.sign(user);
  }

  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password').lean();
  }
}
