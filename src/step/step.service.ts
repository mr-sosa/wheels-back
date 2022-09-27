import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { StepEntity } from './step.entity';

@Injectable()
export class StepService {
  constructor(
    @InjectRepository(StepEntity)
    private readonly stepRepository: Repository<StepEntity>,
  ) {}

  async findAll(): Promise<StepEntity[]> {
    return await this.stepRepository.find({
      relations: ['startPoint', 'endPoint', 'route'],
    });
  }

  async findOne(id: string): Promise<StepEntity> {
    const step: StepEntity = await this.stepRepository.findOne({
      where: { id },
      relations: ['startPoint', 'endPoint', 'route'],
    });
    if (!step)
      throw new BusinessLogicException(
        'The step with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return step;
  }

  async create(step: StepEntity): Promise<StepEntity> {
    return await this.stepRepository.save(step);
  }

  async update(id: string, step: StepEntity): Promise<StepEntity> {
    const persistedStep: StepEntity = await this.stepRepository.findOne({
      where: { id },
      relations: ['startPoint', 'endPoint', 'route'],
    });
    if (!persistedStep)
      throw new BusinessLogicException(
        'The step with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.stepRepository.save({
      ...persistedStep,
      ...step,
    });
  }

  async delete(id: string) {
    const step: StepEntity = await this.stepRepository.findOne({
      where: { id },
      relations: ['startPoint', 'endPoint', 'route'],
    });
    if (!step)
      throw new BusinessLogicException(
        'The step with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.stepRepository.remove(step);
  }
}
