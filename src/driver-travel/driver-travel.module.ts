import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from './driver-travel.entity';
import { DriverTravelService } from './driver-travel.service';
import { DriverTravelController } from './driver-travel.controller';

@Module({
  providers: [DriverTravelService],
  imports: [TypeOrmModule.forFeature([DriverTravelEntity])],
  controllers: [DriverTravelController],
})
export class DriverTravelModule {}
