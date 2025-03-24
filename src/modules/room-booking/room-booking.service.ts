import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import {
  ACCESS_KEY_MOMO,
  SECRET_KEY_MOMO,
} from 'src/common/constant/app.constant';

import crypto from 'crypto';

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
  async paymentMomo(body: any) {
    const { redirectUrl, roomId, startDay, endDay, userId } = body;
    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id: +roomId,
      },
    });

    if (!roomExit) {
      throw new BadRequestException('Không tồn tại phòng này');
    }

    const bookingRoomExit = await this.prisma.dat_phong.findFirst({
      where: {
        ma_phong: +roomId,
        ma_nguoi_dat: +userId,
        ngay_den: new Date(startDay),
        ngay_di: new Date(endDay),
        trang_thai: 'cho_thanh_toan',
      },
    });

    if (!bookingRoomExit) {
      throw new BadRequestException('Không tìm thấy đơn đặt phòng hợp lệ');
    }

    var accessKey = ACCESS_KEY_MOMO;
    var secretKey = SECRET_KEY_MOMO;
    var orderInfo = `Thanh toán tiền đặt phòng ${roomExit.ten_phong}`;
    var partnerCode = 'MOMO';
    var ipnUrl =
      'https://433e-2402-800-6314-65b6-88c-e121-d397-3ce1.ngrok-free.app/room-booking/callback';
    var requestType = 'payWithMethod';
    var amount = roomExit.gia_tien;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    const test = await this.prisma.dat_phong.updateMany({
      where: {
        ma_phong: +roomId,
        ma_nguoi_dat: +userId,
        ngay_den: new Date(startDay),
        ngay_di: new Date(endDay),
        trang_thai: 'cho_thanh_toan',
      },
      data: {
        order_id: orderId,
      },
    });

    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    //signature
    const crypto = require('crypto');
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    let result: any;

    try {
      result = await axios(options);
      return result.data;
    } catch (error) {
      return error;
    }
  }
  async callbackMomo(body: any) {
    const { orderId, resultCode } = body;

    const status = resultCode === 0 ? 'da_thanh_toan' : 'that_bai';

    await this.prisma.dat_phong.updateMany({
      where: { order_id: orderId },
      data: { trang_thai: status },
    });

    return { message: `Booking updated to ${status}` };
  }

  async transactionStatusMomo(body: any) {
    const { orderId } = body;

    const rawSignature = `accessKey=${ACCESS_KEY_MOMO}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const crypto = require('crypto');
    var signature = crypto
      .createHmac('sha256', SECRET_KEY_MOMO)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId,
      signature,
      lang: 'vi',
    });

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };

    let result: any;

    try {
      result = await axios(options);
      return result.data;
    } catch (error) {
      return error;
    }
  }
}
