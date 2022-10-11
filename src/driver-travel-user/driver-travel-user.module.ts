import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { UserEntity } from '../user/user.entity';
import { DriverTravelUserService } from './driver-travel-user.service';

@Module({
  providers: [DriverTravelUserService],
  imports: [TypeOrmModule.forFeature([DriverTravelEntity, UserEntity])],
})
export class DriverTravelUserModule {}
