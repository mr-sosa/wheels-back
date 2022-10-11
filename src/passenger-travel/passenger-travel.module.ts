import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerTravelEntity } from './passenger-travel.entity';
import { PassengerTravelService } from './passenger-travel.service';
import { PassengerTravelController } from './passenger-travel.controller';

@Module({
  providers: [PassengerTravelService],
  imports: [TypeOrmModule.forFeature([PassengerTravelEntity])],
  controllers: [PassengerTravelController],
})
export class PassengerTravelModule {}
