import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [UserModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
