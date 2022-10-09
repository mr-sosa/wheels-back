import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { UserEntity } from '../user/user.entity';
import { UserPassengerTravelService } from './user-passenger-travel.service';

@Module({
  providers: [UserPassengerTravelService],
  imports: [TypeOrmModule.forFeature([UserEntity, PassengerTravelEntity])],
})
export class UserPassengerTravelModule {}
