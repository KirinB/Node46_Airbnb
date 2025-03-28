import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActiveAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}
