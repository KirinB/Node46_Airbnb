import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomBookingService {
  constructor(public prisma: PrismaService) {}
  async create(createRoomBookingDto: CreateRoomBookingDto) {
    const { ma_nguoi_dat, ma_phong } = createRoomBookingDto;
    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id: ma_phong,
      },
    });

    if (!roomExit)
      throw new BadRequestException(`Không tìm thấy phòng với ID: ${ma_phong}`);

    const userExit = await this.prisma.nguoi_dung.findUnique({
      where: {
        id: ma_nguoi_dat,
      },
    });

    if (!userExit)
      throw new BadRequestException(
        `Không tìm thấy người dùng với ID: ${ma_nguoi_dat}`,
      );

    const newRoomBooking = await this.prisma.dat_phong.create({
      data: {
        ...createRoomBookingDto,
      },
    });

    return newRoomBooking;
  }

  async findAll() {
    const listRoomBooking = await this.prisma.dat_phong.findMany();
    return listRoomBooking;
  }

  async findOne(id: number) {
    const roomBookingExit = await this.prisma.dat_phong.findUnique({
      where: {
        id,
      },
    });

    if (!roomBookingExit)
      throw new BadRequestException(
        `Không tìm thấy thông tin đặt phòng với ID: ${id}`,
      );

    return roomBookingExit;
  }

  async update(id: number, updateRoomBookingDto: UpdateRoomBookingDto) {
    const roomBookingExit = await this.prisma.dat_phong.findUnique({
      where: {
        id,
      },
    });

    if (!roomBookingExit)
      throw new BadRequestException(
        `Không tìm thấy thông tin đặt phòng với ID: ${id}`,
      );

    const updateData: Partial<UpdateRoomBookingDto> = {
      ...updateRoomBookingDto,
    };

    const updateRoomBooking = await this.prisma.dat_phong.update({
      where: { id },
      data: updateData,
    });

    return updateRoomBooking;
  }

  async remove(id: number) {
    const roomBookingExit = await this.prisma.dat_phong.findUnique({
      where: {
        id,
      },
    });

    if (!roomBookingExit)
      throw new BadRequestException(
        `Không tìm thấy thông tin đặt phòng với ID: ${id}`,
      );

    await this.prisma.dat_phong.delete({
      where: {
        id,
      },
    });

    return `Xóa thành công thông tin đặt phòng với ID: ${id}`;
  }
  async getRoomBookingByIdUser(
    id: number,
    page: number,
    pageSize: number,
    search: string,
  ) {
    const where = {
      ma_nguoi_dat: id,
      ...(search.trim()
        ? { noi_dung: { contains: search, mode: 'insensitive' } }
        : {}),
    };

    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.dat_phong.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    const roomBooking = await this.prisma.dat_phong.findMany({
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
      items: roomBooking || [],
    };
  }
}
