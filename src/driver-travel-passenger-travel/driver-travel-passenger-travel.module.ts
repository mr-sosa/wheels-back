import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { DriverTravelPassengerTravelService } from './driver-travel-passenger-travel.service';

@Module({
  providers: [DriverTravelPassengerTravelService],
  imports: [
    TypeOrmModule.forFeature([DriverTravelEntity, PassengerTravelEntity]),
  ],
})
export class DriverTravelPassengerTravelModule {}
