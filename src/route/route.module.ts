import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteEntity } from './route.entity';
import { RouteService } from './route.service';

@Module({
  providers: [RouteService],
  imports: [TypeOrmModule.forFeature([RouteEntity])],
})
export class RouteModule {}
