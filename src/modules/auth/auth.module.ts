import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from './facebook/facebook.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy],
  imports: [JwtModule, PassportModule],
})
export class AuthModule {}
