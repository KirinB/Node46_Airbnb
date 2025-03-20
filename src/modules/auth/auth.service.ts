import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-auth.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    public prisma: PrismaService,
    public jwt: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, pass_word } = loginAuthDto;

    const userExit = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });

    if (!userExit) {
      throw new BadRequestException('Sai email hoặc password');
    }

    if (!userExit.pass_word) {
      throw new BadRequestException(
        'Không hợp lệ, vui lòng liên hệ chăm sóc khách hàng',
      );
    }

    //so sánh password (không phải dịch ngược)
    const isSuccess = bcrypt.compareSync(pass_word, userExit.pass_word);

    if (!isSuccess) throw new BadRequestException('Mật khẩu không chính xác');

    const tokens = this.createTokens(userExit.id);

    return { ...userExit, pass_word: undefined, id: undefined, tokens };
  }

  async register(registerDto: RegisterDto) {
    const { email, name, pass_word, birth_day, gender, phone } = registerDto;

    const userExits = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });

    if (userExits) {
      throw new BadRequestException('Đã có người dùng này rồi!');
    }

    const passHash = bcrypt.hashSync(pass_word, 10);

    const userNew = await this.prisma.nguoi_dung.create({
      data: {
        name,
        email,
        pass_word: passHash,
        birth_day,
        gender,
        phone,
      },
    });

    return { ...userNew, pass_word: undefined };
  }

  createTokens(userId: number) {
    if (!userId) throw new BadRequestException('Không có userId để tạo token');

    const accessToken = this.jwt.sign(
      { userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRED,
        secret: ACCESS_TOKEN_SECRET,
      },
    );
    const refreshToken = this.jwt.sign(
      { userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRED,
        secret: REFRESH_TOKEN_SECRET,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateFacebookUser(profile: {
    facebook_id: string;
    name: string;
    email?: string;
    avatar?: string;
  }) {
    let user = await this.prisma.nguoi_dung.findUnique({
      where: { facebook_id: profile.facebook_id },
    });

    if (!user) {
      user = await this.prisma.nguoi_dung.create({
        data: {
          facebook_id: profile.facebook_id,
          name: profile.name,
          email: profile.email ?? '',
          avatar: profile.avatar,
          pass_word: '',
        },
      });
    }

    const tokens = this.createTokens(user.id);

    return { user, tokens };
  }
}
