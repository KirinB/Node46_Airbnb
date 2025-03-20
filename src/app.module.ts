import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import PrismaModule from './modules/prisma/prisma.module';
import { CheckTokenStrategy } from './modules/auth/token/token-stratery';
import { LocationModule } from './modules/location/location.module';
import { RoomModule } from './modules/room/room.module';
import { CommentModule } from './modules/comment/comment.module';
import { RoomBookingModule } from './modules/room-booking/room-booking.module';
import { CheckPermissionStrategy } from './modules/auth/permission/permission-strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PrismaModule,
    AuthModule,
    LocationModule,
    RoomModule,
    CommentModule,
    RoomBookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, CheckTokenStrategy, CheckPermissionStrategy],
})
export class AppModule {}
