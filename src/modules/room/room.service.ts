import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';

import { v2 as cloudinary } from 'cloudinary';
import {
  API_KEY_CLOUD,
  API_SECRET_CLOUD,
  CLOUD_NAME,
} from 'src/common/constant/app.constant';
@Injectable()
export class RoomService {
  constructor(public prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto) {
    const newRoom = await this.prisma.phong.create({
      data: {
        ...createRoomDto,
      },
    });

    return { ...newRoom, ma_vi_tri: undefined };
  }

  async findAll() {
    const listRoom = await this.prisma.phong.findMany();
    return listRoom;
  }

  async findOne(id: number) {
    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id,
      },
      include: {
        vi_tri: true,
      },
    });

    if (!roomExit)
      throw new BadRequestException(`Không tìm thấy phòng với ID: ${id}`);

    return roomExit;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id,
      },
    });

    if (!roomExit)
      throw new BadRequestException(`Không tìm thấy phòng với ID: ${id}`);

    const updateData: Partial<UpdateRoomDto> = { ...updateRoomDto };

    const updateRoom = await this.prisma.phong.update({
      where: { id },
      data: updateData,
    });

    return updateRoom;
  }

  async remove(id: number) {
    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id,
      },
    });

    if (!roomExit)
      throw new BadRequestException(`Không tìm thấy phòng với ID: ${id}`);

    await this.prisma.phong.delete({
      where: { id },
    });
    return `Đã xóa phòng với ID :${id}`;
  }
  async getRoomByLocation(ma_vi_tri: number) {
    console.log(ma_vi_tri);

    const listRoom = await this.prisma.phong.findMany({
      where: {
        ma_vi_tri,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    console.log(listRoom);
    return listRoom.map(({ ma_vi_tri, ...room }) => room);
  }

  async pagination(page: number, pageSize: number, search: string) {
    const where = {
      ...(search?.trim() ? { ten_phong: { contains: search } } : {}),
    };

    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.phong.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    const room = await this.prisma.phong.findMany({
      take: pageSize,
      skip,
      orderBy: { created_at: 'desc' },
      where,
    });

    return {
      page,
      pageSize,
      totalPage,
      totalItem,
      items: room || [],
    };
  }

  async uploadImageRoom(file: any, roomId: number) {
    console.log({ file, roomId });
    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!roomExit)
      throw new BadRequestException(`Không tìm thấy phòng với ID: ${roomId}`);

    if (!file) {
      throw new BadRequestException(
        'Vui lòng gửi hình ảnh lên thông qua key file (from-data)',
      );
    }
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY_CLOUD,
      api_secret: API_SECRET_CLOUD,
    });

    const uploadResult: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'images',
          },
          (error, uploadResult) => {
            return resolve(uploadResult);
          },
        )
        .end(file.buffer);
    });

    await this.prisma.phong.update({
      where: {
        id: roomId,
      },
      data: {
        hinh_anh: uploadResult.secure_url,
      },
    });

    return {
      folder: 'images/',
      filename: file.filename,
      imgUrl: uploadResult.secure_url,
    };
  }
}
