import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoomBookingDto {
  @IsNotEmpty()
  @IsNumber()
  ma_phong: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  ngay_den: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  ngay_di: Date;

  @IsNumber()
  @IsNotEmpty()
  so_luong_khach: number;

  @IsNumber()
  @IsNotEmpty()
  ma_nguoi_dat: number;
}
