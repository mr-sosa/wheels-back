import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointEntity } from './point.entity';
import { PointService } from './point.service';

@Module({
  providers: [PointService],
  imports: [TypeOrmModule.forFeature([PointEntity])],
})
export class PointModule {}
