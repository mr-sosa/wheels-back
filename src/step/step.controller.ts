import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { StepDto } from './step.dto';
import { StepEntity } from './step.entity';
import { StepService } from './step.service';

@Controller('steps')
@UseInterceptors(BusinessErrorsInterceptor)
export class StepController {
  constructor(private readonly stepService: StepService) {}

  @Get()
  async findAll() {
    return await this.stepService.findAll();
  }

  @Get(':stepId')
  async findOne(@Param('stepId') stepId: string) {
    return await this.stepService.findOne(stepId);
  }

  @Post()
  async create(@Body() stepDto: StepDto) {
    const step: StepEntity = plainToInstance(StepEntity, stepDto);
    return await this.stepService.create(step);
  }

  @Put(':stepId')
  async update(@Param('stepId') stepId: string, @Body() stepDto: StepDto) {
    const step: StepEntity = plainToInstance(StepEntity, stepDto);
    return await this.stepService.update(stepId, step);
  }

  @Delete(':stepId')
  @HttpCode(204)
  async delete(@Param('stepId') stepId: string) {
    return await this.stepService.delete(stepId);
  }
}
