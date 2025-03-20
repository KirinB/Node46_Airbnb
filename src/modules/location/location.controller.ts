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
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ResponseSuccess } from 'src/common/decorators/response-success.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @ResponseSuccess('Lấy danh sách vị trí thành công')
  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get('phan-trang-tim-kiem')
  pagniation(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.locationService.pagniation(+page, +pageSize, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }

  @UseInterceptors(FileInterceptor('location'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @Post('upload-hinh-vitri')
  uploadImageLocation(
    @UploadedFile() file: any,
    @Query('maViTri') locationId: string,
  ) {
    return this.locationService.uploadImageLocation(file, +locationId);
  }
}
