import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from 'src/driver-travel/driver-travel.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserDriverTravelByDriverService } from './user-driver-travel-by-driver.service';

@Module({
  providers: [UserDriverTravelByDriverService],
  imports: [TypeOrmModule.forFeature([UserEntity, DriverTravelEntity])],
})
export class UserDriverTravelByDriverModule {}
