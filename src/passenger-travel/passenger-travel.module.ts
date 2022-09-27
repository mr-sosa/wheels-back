import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerTravelService } from './passenger-travel.service';

@Module({
  providers: [PassengerTravelService],
  imports: [TypeOrmModule.forFeature([PassengerTravelModule])],
})
export class PassengerTravelModule {}
