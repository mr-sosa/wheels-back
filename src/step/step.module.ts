import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepEntity } from './step.entity';
import { StepService } from './step.service';
import { StepController } from './step.controller';

@Module({
  providers: [StepService],
  imports: [TypeOrmModule.forFeature([StepEntity])],
  controllers: [StepController],
})
export class StepModule {}
