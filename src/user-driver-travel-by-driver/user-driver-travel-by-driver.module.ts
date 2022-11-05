import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from 'src/driver-travel/driver-travel.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserDriverTravelByDriverService } from './user-driver-travel-by-driver.service';
import { UserDriverTravelByDriverController } from './user-driver-travel-by-driver.controller';

@Module({
  providers: [UserDriverTravelByDriverService],
  imports: [TypeOrmModule.forFeature([UserEntity, DriverTravelEntity])],
  controllers: [UserDriverTravelByDriverController],
})
export class UserDriverTravelByDriverModule {}
