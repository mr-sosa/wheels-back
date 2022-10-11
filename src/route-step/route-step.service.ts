import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RouteEntity } from '../route/route.entity';
import { StepEntity } from '../step/step.entity';

@Injectable()
export class RouteStepService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,

    @InjectRepository(StepEntity)
    private readonly stepRepository: Repository<StepEntity>,
  ) {}

  async addStepRoute(routeId: string, stepId: string): Promise<RouteEntity> {
    const step: StepEntity = await this.stepRepository.findOne({
      where: { id: stepId },
    });
    if (!step)
      throw new BusinessLogicException(
        'The step with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['steps'],
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    route.steps = [...route.steps, step];
    return await this.routeRepository.save(route);
  }

  async findStepByRouteIdStepId(
    routeId: string,
    stepId: string,
  ): Promise<StepEntity> {
    return await this.validate(routeId, stepId);
  }

  async findStepsByRouteId(routeId: string): Promise<StepEntity[]> {
    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['steps'],
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return route.steps;
  }

  async associateStepsRoute(
    routeId: string,
    steps: StepEntity[],
  ): Promise<RouteEntity> {
    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['steps'],
    });

    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < steps.length; i++) {
      const step: StepEntity = await this.stepRepository.findOne({
        where: { id: steps[i].id },
      });
      if (!step)
        throw new BusinessLogicException(
          'The step with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    route.steps = steps;
    return await this.routeRepository.save(route);
  }

  async deleteStepRoute(routeId: string, stepId: string) {
    await this.validate(routeId, stepId);

    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['steps'],
    });

    route.steps = route.steps.filter((e) => e.id !== stepId);
    await this.routeRepository.save(route);
  }

  async validate(routeId: string, stepId: string) {
    const step: StepEntity = await this.stepRepository.findOne({
      where: { id: stepId },
    });
    if (!step)
      throw new BusinessLogicException(
        'The step with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['steps'],
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const routeStep: StepEntity = route.steps.find((e) => e.id === step.id);

    if (!routeStep)
      throw new BusinessLogicException(
        'The step with the given id is not associated to the route',
        BusinessError.PRECONDITION_FAILED,
      );

    return routeStep;
  }
}
