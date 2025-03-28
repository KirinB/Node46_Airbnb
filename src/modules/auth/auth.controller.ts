import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { RegisterDto } from './dto/register-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';
import { ActiveAuthDto } from './dto/active-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordDto } from './dto/reset-password-auth.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiExcludeEndpoint()
  async facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiExcludeEndpoint()
  facebookLoginCallback(@Req() req: any) {
    return req.user;
  }

  @Post('active-account')
  activeAccount(@Body() activeAccountDto: ActiveAuthDto) {
    return this.authService.activeAccount(activeAccountDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
