import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any;
}

export class FilesUploadDto {
  avatar: any[];
}
