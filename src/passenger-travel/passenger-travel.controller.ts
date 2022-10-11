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
import { PassengerTravelDto } from './passenger-travel.dto';
import { PassengerTravelEntity } from './passenger-travel.entity';
import { PassengerTravelService } from './passenger-travel.service';

@Controller('passengerTravels')
@UseInterceptors(BusinessErrorsInterceptor)
export class PassengerTravelController {
  constructor(
    private readonly passengerTravelService: PassengerTravelService,
  ) {}

  @Get()
  async findAll() {
    return await this.passengerTravelService.findAll();
  }

  @Get(':passengerTravelId')
  async findOne(@Param('passengerTravelId') passengerTravelId: string) {
    return await this.passengerTravelService.findOne(passengerTravelId);
  }

  @Post()
  async create(@Body() passengerTravelDto: PassengerTravelDto) {
    const passengerTravel: PassengerTravelEntity = plainToInstance(
      PassengerTravelEntity,
      passengerTravelDto,
    );
    return await this.passengerTravelService.create(passengerTravel);
  }

  @Put(':passengerTravelId')
  async update(
    @Param('passengerTravelId') passengerTravelId: string,
    @Body() passengerTravelDto: PassengerTravelDto,
  ) {
    const passengerTravel: PassengerTravelEntity = plainToInstance(
      PassengerTravelEntity,
      passengerTravelDto,
    );
    return await this.passengerTravelService.update(
      passengerTravelId,
      passengerTravel,
    );
  }

  @Delete(':passengerTravelId')
  @HttpCode(204)
  async delete(@Param('passengerTravelId') passengerTravelId: string) {
    return await this.passengerTravelService.delete(passengerTravelId);
  }
}
