import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { DriverTravelModule } from './driver-travel/driver-travel.module';

@Module({
  imports: [UserModule, VehicleModule, DriverTravelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
