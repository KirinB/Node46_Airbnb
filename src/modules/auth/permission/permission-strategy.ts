import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
//CheckTokenStrategy gắn vào app module
@Injectable()
export class CheckPermissionStrategy extends PassportStrategy(
  Strategy,
  'check-permission',
) {
  constructor(public prisma: PrismaService) {
    super();
  }

  async validate(req: any) {
    const user = req.user;
    const role = user.role;

    //Nếu là ADMIN (role_id === 1) thì cho qua
    //bắt buộc phải có return không code sẽ chạy tiếp tục
    if (role !== 'ADMIN') return false;

    return true;
  }
}
