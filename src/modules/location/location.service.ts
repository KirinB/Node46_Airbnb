import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import {
  API_KEY_CLOUD,
  API_SECRET_CLOUD,
  CLOUD_NAME,
} from 'src/common/constant/app.constant';

@Injectable()
export class LocationService {
  constructor(public prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    const { hinh_anh, quoc_gia, ten_vi_tri, tinh_thanh } = createLocationDto;
    await this.prisma.vi_tri.create({
      data: {
        ten_vi_tri,
        hinh_anh,
        quoc_gia,
        tinh_thanh,
      },
    });
    return `Đã thêm ${ten_vi_tri} vào`;
  }

  async findAll() {
    const listLocation = await this.prisma.vi_tri.findMany();
    return listLocation;
  }

  async findOne(id: number) {
    const locationExit = await this.prisma.vi_tri.findUnique({
      where: {
        id,
      },
    });
    if (!locationExit)
      throw new BadRequestException(`Không tìm thấy vị trí với ID: ${id}`);
    return locationExit;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const locationExit = await this.prisma.vi_tri.findUnique({
      where: {
        id,
      },
    });

    if (!locationExit) {
      throw new BadRequestException(
        `Không tìm thấy vị trí cần cập nhật với ID: ${id}`,
      );
    }

    const updateData: Partial<UpdateLocationDto> = { ...updateLocationDto };

    const updateLocation = await this.prisma.vi_tri.update({
      where: { id },
      data: updateData,
    });

    return updateLocation;
  }

  async remove(id: number) {
    const locationExit = await this.prisma.vi_tri.findUnique({
      where: {
        id,
      },
    });

    if (!locationExit) {
      throw new BadRequestException(`Không tìm thấy vị trí với ID: ${id}`);
    }

    await this.prisma.vi_tri.delete({
      where: {
        id,
      },
    });
    return `Xóa vị trí thành công`;
  }

  async pagniation(page: number, pageSize: number, search: string) {
    const where = {
      ...(search?.trim() ? { ten_vi_tri: { contains: search } } : {}),
    };

    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.vi_tri.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    const location = await this.prisma.vi_tri.findMany({
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
      items: location || [],
    };
  }

  async uploadImageLocation(file: any, locationId: number) {
    const locationExit = await this.prisma.vi_tri.findUnique({
      where: {
        id: locationId,
      },
    });

    if (!locationExit)
      throw new BadRequestException(
        `Không tìm thấy vị trí có ID: ${locationId}`,
      );

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

    await this.prisma.vi_tri.update({
      where: {
        id: locationId,
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
