import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomBookingService } from './room-booking.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';
import { Public } from 'src/common/decorators/is-public.decorator';

@Controller('room-booking')
export class RoomBookingController {
  constructor(private readonly roomBookingService: RoomBookingService) {}

  @Post()
  create(@Body() createRoomBookingDto: CreateRoomBookingDto) {
    return this.roomBookingService.create(createRoomBookingDto);
  }

  @Get()
  findAll() {
    return this.roomBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomBookingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomBookingDto: UpdateRoomBookingDto,
  ) {
    return this.roomBookingService.update(+id, updateRoomBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomBookingService.remove(+id);
  }

  @Get('/lay-theo-nguoi-dung/:id')
  getRoomBookingByIdUser(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search: string = '',
  ) {
    return this.roomBookingService.getRoomBookingByIdUser(
      +id,
      +page,
      +pageSize,
      search,
    );
  }
  @Post('/momo/')
  paymentMomo(@Body() body: any) {
    return this.roomBookingService.paymentMomo(body);
  }

  @Public()
  @Post('callback')
  callbackMomo(@Body() body: any) {
    console.log(body);
    return this.roomBookingService.callbackMomo(body);
  }

  @Post('/transaction-status/')
  transactionStatusMomo(@Body() body: any) {
    return this.roomBookingService.transactionStatusMomo(body);
  }
}
