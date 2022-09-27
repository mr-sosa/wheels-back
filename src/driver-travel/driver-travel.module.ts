import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from './driver-travel.entity';
import { DriverTravelService } from './driver-travel.service';

@Module({
  providers: [DriverTravelService],
  imports: [TypeOrmModule.forFeature([DriverTravelEntity])],
})
export class DriverTravelModule {}
