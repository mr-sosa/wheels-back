import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteEntity } from '../route/route.entity';
import { StepEntity } from '../step/step.entity';
import { RouteStepService } from './route-step.service';

@Module({
  providers: [RouteStepService],
  imports: [TypeOrmModule.forFeature([RouteEntity, StepEntity])],
})
export class RouteStepModule {}
