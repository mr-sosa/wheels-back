import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { RouteEntity } from '../route/route.entity';
import { DriverTravelRouteService } from './driver-travel-route.service';

@Module({
  providers: [DriverTravelRouteService],
  imports: [TypeOrmModule.forFeature([DriverTravelEntity, RouteEntity])],
})
export class DriverTravelRouteModule {}
