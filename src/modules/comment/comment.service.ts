import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(public prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto) {
    const { ma_nguoi_binh_luan, ma_phong } = createCommentDto;

    const userExit = await this.prisma.nguoi_dung.findUnique({
      where: {
        id: ma_nguoi_binh_luan,
      },
    });

    if (!userExit) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const roomExit = await this.prisma.phong.findUnique({
      where: {
        id: ma_phong,
      },
    });

    if (!roomExit) throw new BadRequestException(`Phòng không tồn tại`);

    await this.prisma.binh_luan.create({
      data: {
        ...createCommentDto,
      },
    });
    return 'Bình luận thành công';
  }

  async findAll() {
    const listComment = await this.prisma.binh_luan.findMany();
    return listComment;
  }

  async findOne(id: number) {
    const commentExit = await this.prisma.binh_luan.findUnique({
      where: {
        id,
      },
    });

    if (!commentExit)
      throw new BadRequestException(`Không tìm thấy bình luận với ID: ${id}`);

    return commentExit;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const commentExit = await this.prisma.binh_luan.findUnique({
      where: {
        id,
      },
    });

    if (!commentExit)
      throw new BadRequestException(`Không tìm thấy bình luận với ID: ${id}`);

    const updateData: Partial<UpdateCommentDto> = { ...updateCommentDto };

    const updateRoom = await this.prisma.binh_luan.update({
      where: { id },
      data: updateData,
    });

    return updateRoom;
  }

  async remove(id: number) {
    const commentExit = await this.prisma.binh_luan.findUnique({
      where: {
        id,
      },
    });

    if (!commentExit)
      throw new BadRequestException(`Không tìm thấy bình luận với ID: ${id}`);

    await this.prisma.binh_luan.delete({
      where: {
        id,
      },
    });
    return `Đã xóa bình luận với ID: ${id}`;
  }

  async getCommentByIdRoom(
    id: number,
    page: number,
    pageSize: number,
    search: string,
  ) {
    const where = {
      ma_phong: id,
      ...(search.trim()
        ? { noi_dung: { contains: search, mode: 'insensitive' } }
        : {}),
    };

    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.binh_luan.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    const comments = await this.prisma.binh_luan.findMany({
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
      items: comments || [],
    };
  }
}
