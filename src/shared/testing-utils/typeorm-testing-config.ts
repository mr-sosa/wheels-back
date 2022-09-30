import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../../address/address.entity';
import { DriverTravelEntity } from '../../driver-travel/driver-travel.entity';
import { OpinionEntity } from '../../opinion/opinion.entity';
import { PassengerTravelEntity } from '../../passenger-travel/passenger-travel.entity';
import { PointEntity } from '../../point/point.entity';
import { PreferenceEntity } from '../../preference/preference.entity';
import { RouteEntity } from '../../route/route.entity';
import { StepEntity } from '../../step/step.entity';
import { UserEntity } from '../../user/user.entity';
import { VehicleEntity } from '../../vehicle/vehicle.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      AddressEntity,
      DriverTravelEntity,
      OpinionEntity,
      PassengerTravelEntity,
      PointEntity,
      PreferenceEntity,
      RouteEntity,
      StepEntity,
      UserEntity,
      VehicleEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    AddressEntity,
    DriverTravelEntity,
    OpinionEntity,
    PassengerTravelEntity,
    PointEntity,
    PreferenceEntity,
    RouteEntity,
    StepEntity,
    UserEntity,
    VehicleEntity,
  ]),
];
