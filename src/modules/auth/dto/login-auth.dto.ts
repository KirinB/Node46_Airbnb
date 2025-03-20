import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString({ message: 'Vui lòng nhập chuỗi ký tự cho trường email' })
  @IsNotEmpty({ message: 'Vui lòng không để trống cho trường email' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Vui lòng nhập chuỗi ký tự password' })
  @IsNotEmpty({ message: 'Vui lòng không để trống password' })
  pass_word: string;
}
