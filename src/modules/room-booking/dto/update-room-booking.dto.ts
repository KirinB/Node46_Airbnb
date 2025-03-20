import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomBookingDto } from './create-room-booking.dto';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoomBookingDto extends PartialType(CreateRoomBookingDto) {
  @IsOptional()
  @IsNumber()
  ma_phong: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ngay_den: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  ngay_di: Date;

  @IsNumber()
  @IsOptional()
  so_luong_khach: number;

  @IsNumber()
  @IsOptional()
  ma_nguoi_dat: number;
}
