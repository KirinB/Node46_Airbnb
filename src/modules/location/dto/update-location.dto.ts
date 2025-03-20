import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsString()
  @IsOptional()
  ten_vi_tri?: string;

  @IsOptional()
  @IsString()
  tinh_thanh?: string;

  @IsOptional()
  @IsNumber()
  quoc_gia?: number;

  @IsOptional()
  @IsString()
  hinh_anh?: string;
}
