import {
  BadGatewayException,
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/is-public.decorator';
import { SKIP_PERMISSION } from 'src/common/decorators/skip-permission.decorators';

@Injectable()
export class PermissionCheck extends AuthGuard('check-permission') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // console.log({ isPublic });

    const skipPermission = this.reflector.getAllAndOverride<boolean>(
      SKIP_PERMISSION,
      [context.getHandler(), context.getClass()],
    );

    console.log(skipPermission);
    if (skipPermission) {
      return true;
    }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new BadGatewayException('Không đủ quyền truy cập');
    }
    return user;
  }
}
