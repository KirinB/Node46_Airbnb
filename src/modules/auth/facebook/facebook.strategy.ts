import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
} from 'src/common/constant/app.constant';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: FACEBOOK_APP_ID as string,
      clientSecret: FACEBOOK_APP_SECRET as string,
      callbackURL: FACEBOOK_CALLBACK_URL as string,
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, displayName, emails, photos } = profile;
    const user = await this.authService.validateFacebookUser({
      facebook_id: id,
      name: displayName,
      email: emails?.[0]?.value as string,
      avatar: photos?.[0]?.value,
    });

    return user;
  }
}
