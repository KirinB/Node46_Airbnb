import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  ma_phong: number;

  @IsNumber()
  @IsNotEmpty()
  ma_nguoi_binh_luan: number;

  @IsDate()
  @Type(() => Date)
  ngay_binh_luan: Date;

  @IsString()
  @IsNotEmpty()
  noi_dung: string;

  @IsNumber()
  sao_binh_luan: number;
}
