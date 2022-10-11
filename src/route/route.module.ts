import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteEntity } from './route.entity';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';

@Module({
  providers: [RouteService],
  imports: [TypeOrmModule.forFeature([RouteEntity])],
  controllers: [RouteController],
})
export class RouteModule {}
