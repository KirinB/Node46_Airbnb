import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNumber()
  @IsOptional()
  ma_phong: number;

  @IsOptional()
  @IsNumber()
  ma_nguoi_binh_luan: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ngay_binh_luan: Date;

  @IsOptional()
  @IsString()
  noi_dung: string;

  @IsOptional()
  @IsNumber()
  sao_binh_luan: number;
}
