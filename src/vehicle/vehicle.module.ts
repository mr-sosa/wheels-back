import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';

@Module({
  providers: [VehicleService],
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
  controllers: [VehicleController],
})
export class VehicleModule {}
