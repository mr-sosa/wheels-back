import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './vehicle.entity';
import { VehicleService } from './vehicle.service';

@Module({
  providers: [VehicleService],
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
})
export class VehicleModule {}
