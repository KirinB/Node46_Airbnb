import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Vui lòng nhập chuỗi ký tự cho trường email' })
  @IsNotEmpty({ message: 'Vui lòng không để trống cho trường email' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Vui lòng nhập chuỗi ký tự mật khẩu' })
  @IsNotEmpty({ message: 'Vui lòng không để trống mật khẩu' })
  pass_word: string;

  @IsString({ message: 'Vui lòng nhập chuỗi ký tự trường tên' })
  @IsNotEmpty({ message: 'Vui lòng không để trống trường tên' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Vui lòng nhập chuỗi ký tự cho số điện thoại' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Vui lòng nhập chuỗi ký tự cho sinh nhật' })
  birth_day?: string;

  @IsOptional()
  @IsString({ message: 'Vui lòng nhập chuỗi ký tự cho giới tính' })
  gender?: string;
}
