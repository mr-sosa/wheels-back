import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressModule } from './address/address.module';
import { DriverTravelModule } from './driver-travel/driver-travel.module';
import { OpinionModule } from './opinion/opinion.module';
import { PassengerTravelModule } from './passenger-travel/passenger-travel.module';
import { PointModule } from './point/point.module';
import { PreferenceModule } from './preference/preference.module';
import { RouteModule } from './route/route.module';
import { StepModule } from './step/step.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { AddressEntity } from './address/address.entity';
import { DriverTravelEntity } from './driver-travel/driver-travel.entity';
import { OpinionEntity } from './opinion/opinion.entity';
import { PassengerTravelEntity } from './passenger-travel/passenger-travel.entity';
import { PointEntity } from './point/point.entity';
import { PreferenceEntity } from './preference/preference.entity';
import { RouteEntity } from './route/route.entity';
import { StepEntity } from './step/step.entity';
import { UserEntity } from './user/user.entity';
import { VehicleEntity } from './vehicle/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'wheels',
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
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AddressModule,
    DriverTravelModule,
    PassengerTravelModule,
    PointModule,
    PreferenceModule,
    RouteModule,
    StepModule,
    UserModule,
    VehicleModule,
    OpinionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
