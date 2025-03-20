import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { v2 as cloudinary } from 'cloudinary';
import {
  API_KEY_CLOUD,
  API_SECRET_CLOUD,
  CLOUD_NAME,
} from 'src/common/constant/app.constant';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, name, pass_word, birth_day, gender, phone, role } =
      createUserDto;

    const userExit = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });

    if (userExit) {
      throw new BadRequestException('Đã có người dùng này trong hệ thống');
    }

    const passHash = bcrypt.hashSync(pass_word, 10);

    const newUser = await this.prisma.nguoi_dung.create({
      data: {
        email,
        name,
        pass_word: passHash,
        birth_day,
        gender,
        phone,
        role,
      },
    });

    return { ...newUser, pass_word: undefined };
  }

  async findAll() {
    const allUser = await this.prisma.nguoi_dung.findMany();

    return allUser.map(({ pass_word, ...user }) => user);
  }

  async findOne(id: number) {
    const userExit = await this.prisma.nguoi_dung.findUnique({
      where: {
        id,
      },
    });

    if (!userExit) {
      throw new BadRequestException(`Không tìm thấy người dùng với ID: ${id}`);
    }
    return { ...userExit, pass_word: undefined };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExist = await this.prisma.nguoi_dung.findUnique({
      where: { id },
    });

    if (!userExist) {
      throw new BadRequestException(`Không tìm thấy người dùng với ID: ${id}`);
    }

    const updateData: Partial<UpdateUserDto> = { ...updateUserDto };

    if (updateData.pass_word) {
      updateData.pass_word = bcrypt.hashSync(updateData.pass_word, 10);
    }

    const updatedUser = await this.prisma.nguoi_dung.update({
      where: { id },
      data: updateData,
    });

    return { ...updatedUser, pass_word: undefined };
  }

  async remove(id: number) {
    const userExist = await this.prisma.nguoi_dung.findUnique({
      where: { id },
    });

    if (!userExist) {
      throw new BadRequestException(`Không tìm thấy người dùng với ID: ${id}`);
    }

    await this.prisma.nguoi_dung.delete({
      where: {
        id,
      },
    });

    return `Xóa thành công người dùng với ID: ${id}`;
  }

  async pagination(page: number, pageSize: number, search: string) {
    const where = {
      ...(search?.trim() ? { name: { contains: search } } : {}),
    };

    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.nguoi_dung.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    const users = await this.prisma.nguoi_dung.findMany({
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
      items: users.map(({ pass_word, ...item }) => item) || [],
    };
  }

  async avatarCloud(file: any, user: any) {
    const userExit = this.prisma.nguoi_dung.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExit)
      throw new BadRequestException(`Không tồn tại người dùng này`);

    if (!file) {
      throw new BadRequestException(
        'Vui lòng gửi hình ảnh lên thông qua key file (from-data)',
      );
    }

    // Configuration
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

    await this.prisma.nguoi_dung.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: uploadResult.secure_url,
      },
    });

    return {
      folder: 'images/',
      filename: file.filename,
      imgUrl: uploadResult.secure_url,
    };
  }
}
