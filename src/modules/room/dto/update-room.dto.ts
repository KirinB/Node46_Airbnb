import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ten_phong: string;
  @IsOptional()
  @IsNumber()
  khach?: number;
  @IsOptional()
  @IsNumber()
  phong_ngu?: number;
  @IsOptional()
  @IsNumber()
  giuong?: number;
  @IsOptional()
  @IsNumber()
  phong_tam?: number;
  @IsOptional()
  @IsString()
  mo_ta?: string;
  @IsOptional()
  @IsNumber()
  gia_tien?: number;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  may_giat?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  ban_la?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  tivi?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  dieu_hoa?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  wifi?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  bep?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  do_xe?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  ho_boi?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  ban_ui?: boolean;
  @IsOptional()
  @IsString()
  hinh_anh?: string;
  @IsOptional()
  @IsNumber()
  ma_vi_tri?: number;
}
