import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
//CheckTokenStrategy gắn vào app module
@Injectable()
export class CheckTokenStrategy extends PassportStrategy(
  Strategy,
  'check-token',
) {
  constructor(public prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET as string,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: {
        id: payload.userId,
      },
    });

    //Return cái gì thì nestjs tự động gắn cái đó vào req
    return user;
  }
}
