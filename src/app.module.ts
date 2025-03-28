import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import PrismaModule from './modules/prisma/prisma.module';
import { CheckTokenStrategy } from './modules/auth/token/token-stratery';
import { LocationModule } from './modules/location/location.module';
import { RoomModule } from './modules/room/room.module';
import { CommentModule } from './modules/comment/comment.module';
import { RoomBookingModule } from './modules/room-booking/room-booking.module';
import { CheckPermissionStrategy } from './modules/auth/permission/permission-strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    LocationModule,
    RoomModule,
    CommentModule,
    RoomBookingModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          // ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAILDEV_INCOMING_USER'),
            pass: configService.get<string>('MAILDEV_INCOMING_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: process.cwd() + '/src/mail/template/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CheckTokenStrategy, CheckPermissionStrategy],
})
export class AppModule {}
