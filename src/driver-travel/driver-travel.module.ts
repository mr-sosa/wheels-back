import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelService } from './driver-travel.service';

@Module({
  providers: [DriverTravelService],
  imports: [TypeOrmModule.forFeature([DriverTravelService])],
})
export class DriverTravelModule {}
