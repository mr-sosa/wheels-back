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
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { VehicleDto } from './vehicle.dto';
import { VehicleEntity } from './vehicle.entity';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
@UseInterceptors(BusinessErrorsInterceptor)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  async findAll() {
    return await this.vehicleService.findAll();
  }

  @Get(':vehicleId')
  async findOne(@Param('vehicleId') vehicleId: string) {
    return await this.vehicleService.findOne(vehicleId);
  }

  @Post()
  async create(@Body() vehicleDto: VehicleDto) {
    const vehicle: VehicleEntity = plainToInstance(VehicleEntity, vehicleDto);
    return await this.vehicleService.create(vehicle);
  }

  @Put(':vehicleId')
  async update(
    @Param('vehicleId') vehicleId: string,
    @Body() vehicleDto: VehicleDto,
  ) {
    const vehicle: VehicleEntity = plainToInstance(VehicleEntity, vehicleDto);
    return await this.vehicleService.update(vehicleId, vehicle);
  }

  @Delete(':vehicleId')
  @HttpCode(204)
  async delete(@Param('vehicleId') vehicleId: string) {
    return await this.vehicleService.delete(vehicleId);
  }
}
