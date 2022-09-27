import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepEntity } from './step.entity';
import { StepService } from './step.service';

@Module({
  providers: [StepService],
  imports: [TypeOrmModule.forFeature([StepEntity])],
})
export class StepModule {}
