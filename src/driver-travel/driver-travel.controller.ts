import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  Query,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { DriverTravelDto } from './driver-travel.dto';
import { DriverTravelEntity } from './driver-travel.entity';
import { DriverTravelService } from './driver-travel.service';

@Controller('driverTravels')
@UseInterceptors(BusinessErrorsInterceptor)
export class DriverTravelController {
  constructor(private readonly driverTravelService: DriverTravelService) {}

  @Get()
  async findAll(
    @Query('p') page: number,
    @Query('state') state: string,
    @Query('date') date: Date,
    @Query('quota') quota: number,
    @Query('originLat') originLat: string,
    @Query('originLng') originLng: string,
    @Query('destinationLat') destinationLat: string,
    @Query('destinationLng') destinationLng: string,
  ) {
    let data = await this.driverTravelService.findAll(
      page,
      state,
      date,
      quota,
      originLat,
      originLng,
      destinationLat,
      destinationLng,
    );
    return { page: page, numItems: data.length, data: data };
  }

  @Get(':driverTravelId')
  async findOne(@Param('driverTravelId') driverTravelId: string) {
    return await this.driverTravelService.findOne(driverTravelId);
  }

  @Post()
  async create(@Body() driverTravelDto: DriverTravelDto) {
    const driverTravel: DriverTravelEntity = plainToInstance(
      DriverTravelEntity,
      driverTravelDto,
    );
    return await this.driverTravelService.create(driverTravel);
  }

  @Put(':driverTravelId')
  async update(
    @Param('driverTravelId') driverTravelId: string,
    @Body() driverTravelDto: DriverTravelDto,
  ) {
    const driverTravel: DriverTravelEntity = plainToInstance(
      DriverTravelEntity,
      driverTravelDto,
    );
    return await this.driverTravelService.update(driverTravelId, driverTravel);
  }

  @Delete(':driverTravelId')
  @HttpCode(204)
  async delete(@Param('driverTravelId') driverTravelId: string) {
    return await this.driverTravelService.delete(driverTravelId);
  }

  @Post(':driverTravelId/reserved')
  async reservedTravel(@Param('driverTravelId') driverTravelId: string) {
    let driverTravel = await this.driverTravelService.findOne(driverTravelId);
    driverTravel.spaceAvailable--;
    return await this.driverTravelService.update(driverTravelId, driverTravel);
  }
}
