import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ResponseSuccess } from 'src/common/decorators/response-success.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @ResponseSuccess('Lấy danh sách phòng thành công')
  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

  @Get('/lay-phong-theo-vi-tri/')
  getRoomByLocation(@Query('maViTri') ma_vi_tri: string) {
    return this.roomService.getRoomByLocation(+ma_vi_tri);
  }

  @Get('phan-trang-tim-kiem')
  pagniation(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.roomService.pagination(+page, +pageSize, search);
  }

  @UseInterceptors(FileInterceptor('room'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @Post('upload-hinh-phong')
  uploadImageRoom(@UploadedFile() file: any, @Query('maPhong') roomId: string) {
    return this.roomService.uploadImageRoom(file, +roomId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }
}
