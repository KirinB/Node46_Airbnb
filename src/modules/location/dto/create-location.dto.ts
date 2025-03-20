import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  ten_vi_tri: string;

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
