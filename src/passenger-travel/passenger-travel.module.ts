import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerTravelEntity } from './passenger-travel.entity';
import { PassengerTravelService } from './passenger-travel.service';

@Module({
  providers: [PassengerTravelService],
  imports: [TypeOrmModule.forFeature([PassengerTravelEntity])],
})
export class PassengerTravelModule {}
