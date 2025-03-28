import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';

import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { ActiveAuthDto } from './dto/active-auth.dto';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordDto } from './dto/reset-password-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    public prisma: PrismaService,
    public jwt: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
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

    if (!userExit.isActive)
      throw new ForbiddenException('Tài khoản chưa kích hoạt');

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

    const codeId = uuidv4();

    const expiration = dayjs().add(1, 'hour').toDate();

    const receiverEmail =
      this.configService.get<string>('NODE_ENV') === 'production'
        ? email
        : this.configService.get<string>('MAILDEV_INCOMING_USER');

    const userNew = await this.prisma.nguoi_dung.create({
      data: {
        name,
        email,
        pass_word: passHash,
        birth_day,
        gender,
        phone,
        isActive: false,
        expiration,
        codeId,
      },
    });

    this.mailerService
      .sendMail({
        to: receiverEmail, // list of receivers
        subject: 'Register Active ✔', // Subject line
        template: 'register.hbs',
        context: {
          name: name ?? email,
          activationCode: codeId,
        },
      })
      .then(() => {})
      .catch(() => {});

    return {
      ...userNew,
      pass_word: undefined,
      isActive: undefined,
      expiration: undefined,
      codeId: undefined,
    };
  }

  async activeAccount(activeAccountDto: ActiveAuthDto) {
    const { code, email } = activeAccountDto;

    const userExits = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
        isActive: false,
      },
    });

    if (!userExits) {
      throw new BadRequestException(
        'Người dùng không tồn tại hoặc đã kích hoạt tài khoản',
      );
    }

    if (userExits.codeId !== code) {
      throw new BadRequestException('Mã kích hoạt không chính xác');
    }

    if (dayjs().isAfter(userExits.expiration)) {
      throw new BadRequestException('Mã kích hoạt đã hết hạn');
    }

    await this.prisma.nguoi_dung.updateMany({
      where: { email },
      data: {
        isActive: true,
        codeId: null,
        expiration: null,
      },
    });

    return 'Kích hoạt tài khoản thành công!';
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const userExits = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if (!userExits) {
      throw new BadRequestException(
        'Người dùng không tồn tại hoặc chưa kích hoạt tài khoản',
      );
    }

    const codeId = uuidv4();

    const expiration = dayjs().add(1, 'hour').toDate();

    const receiverEmail =
      this.configService.get<string>('NODE_ENV') === 'production'
        ? email
        : this.configService.get<string>('MAILDEV_INCOMING_USER');

    this.mailerService
      .sendMail({
        to: receiverEmail, // list of receivers
        subject: 'Forget Password ✔', // Subject line
        template: 'forgetpassword.hbs',
        context: {
          name: userExits.name ?? userExits.email,
          resetCode: codeId,
        },
      })
      .then(() => {})
      .catch(() => {});

    await this.prisma.nguoi_dung.updateMany({
      where: {
        email,
      },
      data: {
        codeId,
        expiration,
      },
    });

    return 'Đã gửi mail chứa Code cho người dùng';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { code, email, password } = resetPasswordDto;

    const userExits = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if (!userExits) {
      throw new BadRequestException(
        'Người dùng không tồn tại hoặc chưa kích hoạt tài khoản',
      );
    }
    if (userExits.codeId !== code) {
      throw new BadRequestException('Mã kích hoạt không chính xác');
    }

    if (dayjs().isAfter(userExits.expiration)) {
      throw new BadRequestException('Mã kích hoạt đã hết hạn');
    }

    const passHash = bcrypt.hashSync(password, 10);

    await this.prisma.nguoi_dung.updateMany({
      where: { email },
      data: {
        pass_word: passHash,
        isActive: true,
        codeId: null,
        expiration: null,
      },
    });
    const updatedUser = await this.prisma.nguoi_dung.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        gender: true,
        phone: true,
      },
    });
    return updatedUser;
  }
}
