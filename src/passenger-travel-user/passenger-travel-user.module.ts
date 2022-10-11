import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { UserEntity } from '../user/user.entity';
import { PassengerTravelUserService } from './passenger-travel-user.service';

@Module({
  providers: [PassengerTravelUserService],
  imports: [TypeOrmModule.forFeature([PassengerTravelEntity, UserEntity])],
})
export class PassengerTravelUserModule {}
