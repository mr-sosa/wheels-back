import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVehicleService } from './user-vehicle.service';
import { UserEntity } from '../user/user.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';

@Module({
  providers: [UserVehicleService],
  imports: [TypeOrmModule.forFeature([UserEntity, VehicleEntity])],
})
export class UserVehicleModule {}
