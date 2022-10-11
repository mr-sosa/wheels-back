import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PreferenceEntity } from '../preference/preference.entity';
import { DriverTravelPreferenceService } from './driver-travel-preference.service';

@Module({
  providers: [DriverTravelPreferenceService],
  imports: [TypeOrmModule.forFeature([DriverTravelEntity, PreferenceEntity])],
})
export class DriverTravelPreferenceModule {}
