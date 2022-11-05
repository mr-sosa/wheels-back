import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { UserEntity } from '../user/user.entity';
import { DriverTravelUserService } from './driver-travel-user.service';
import { DriverTravelUserController } from './driver-travel-user.controller';

@Module({
  providers: [DriverTravelUserService],
  imports: [TypeOrmModule.forFeature([DriverTravelEntity, UserEntity])],
  controllers: [DriverTravelUserController],
})
export class DriverTravelUserModule {}
