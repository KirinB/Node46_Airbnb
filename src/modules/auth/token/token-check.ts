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

@Injectable()
export class TokenCheck extends AuthGuard('check-token') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      //401 : Token hết hạn
      if (info instanceof TokenExpiredError)
        throw new ForbiddenException(info.message);
      //403: Sai token
      if (info instanceof JsonWebTokenError)
        throw new UnauthorizedException(info.message);

      if (info instanceof Error) {
        throw new BadRequestException(info.message);
      }

      throw err || new BadGatewayException();
    }
    return user;
  }
}
