import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RouteStepService } from './route-step.service';
import { RouteEntity } from '../route/route.entity';
import { StepEntity } from '../step/step.entity';

describe('RouteStepService', () => {
  let service: RouteStepService;
  let routeRepository: Repository<RouteEntity>;
  let stepRepository: Repository<StepEntity>;
  let route: RouteEntity;
  let stepsList: StepEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RouteStepService],
    }).compile();

    service = module.get<RouteStepService>(RouteStepService);
    routeRepository = module.get<Repository<RouteEntity>>(
      getRepositoryToken(RouteEntity),
    );
    stepRepository = module.get<Repository<StepEntity>>(
      getRepositoryToken(StepEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    stepRepository.clear();
    routeRepository.clear();

    stepsList = [];
    for (let i = 0; i < 5; i++) {
      const step: StepEntity = await stepRepository.save({
        duration: faker.date.past().getMinutes(),
        distance: faker.datatype.number(1000),
      });
      stepsList.push(step);
    }

    route = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
      steps: stepsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStepRoute should add an step to a route', async () => {
    const newStep: StepEntity = await stepRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    const result: RouteEntity = await service.addStepRoute(
      newRoute.id,
      newStep.id,
    );

    expect(result.steps.length).toBe(1);
    expect(result.steps[0]).not.toBeNull();
    expect(result.steps[0].distance).toStrictEqual(newStep.distance);
    expect(result.steps[0].duration).toStrictEqual(newStep.duration);
  });

  it('addStepRoute should thrown exception for an invalid step', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.addStepRoute(newRoute.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });

  it('addStepRoute should throw an exception for an invalid route', async () => {
    const newStep: StepEntity = await stepRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.addStepRoute('0', newStep.id),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('findStepByRouteIdStepId should return step by route', async () => {
    const step: StepEntity = stepsList[0];
    const storedStep: StepEntity = await service.findStepByRouteIdStepId(
      route.id,
      step.id,
    );

    expect(storedStep).not.toBeNull();
    expect(storedStep.duration).toStrictEqual(step.duration);
    expect(storedStep.distance).toStrictEqual(step.distance);
  });

  it('findStepByRouteIdStepId should throw an exception for an invalid step', async () => {
    await expect(() =>
      service.findStepByRouteIdStepId(route.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });

  it('findStepByRouteIdStepId should throw an exception for an invalid route', async () => {
    const step: StepEntity = stepsList[0];
    await expect(() =>
      service.findStepByRouteIdStepId('0', step.id),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('findStepByRouteIdStepId should throw an exception for an step not associated to the route', async () => {
    const newStep: StepEntity = await stepRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.findStepByRouteIdStepId(route.id, newStep.id),
    ).rejects.toHaveProperty(
      'message',
      'The step with the given id is not associated to the route',
    );
  });

  it('findStepsByRouteId should return steps by route', async () => {
    const steps: StepEntity[] = await service.findStepsByRouteId(route.id);
    expect(steps.length).toBe(5);
  });

  it('findStepsByRouteId should throw an exception for an invalid route', async () => {
    await expect(() => service.findStepsByRouteId('0')).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('associateStepsRoute should update steps list for a route', async () => {
    const newStep: StepEntity = await stepRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    const updatedRoute: RouteEntity = await service.associateStepsRoute(
      route.id,
      [newStep],
    );
    expect(updatedRoute.steps.length).toBe(1);
    expect(updatedRoute.steps[0].duration).toStrictEqual(newStep.duration);
    expect(updatedRoute.steps[0].distance).toStrictEqual(newStep.distance);
  });

  it('associateStepsRoute should throw an exception for an invalid route', async () => {
    const newStep: StepEntity = await stepRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.associateStepsRoute('0', [newStep]),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('associateStepsRoute should throw an exception for an invalid step', async () => {
    const newStep: StepEntity = stepsList[0];
    newStep.id = '0';

    await expect(() =>
      service.associateStepsRoute(route.id, [newStep]),
    ).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });

  it('deleteStepToRoute should remove an step from a route', async () => {
    const step: StepEntity = stepsList[0];

    await service.deleteStepRoute(route.id, step.id);

    const storedRoute: RouteEntity = await routeRepository.findOne({
      where: { id: route.id },
      relations: ['steps'],
    });
    const deletedStep: StepEntity = storedRoute.steps.find(
      (a) => a.id === step.id,
    );

    expect(deletedStep).toBeUndefined();
  });

  it('deleteStepToRoute should thrown an exception for an invalid step', async () => {
    await expect(() =>
      service.deleteStepRoute(route.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });

  it('deleteStepToRoute should thrown an exception for an invalid route', async () => {
    const step: StepEntity = stepsList[0];
    await expect(() =>
      service.deleteStepRoute('0', step.id),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('deleteStepToRoute should thrown an exception for an non asocciated step', async () => {
    const newStep: StepEntity = await stepRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.deleteStepRoute(route.id, newStep.id),
    ).rejects.toHaveProperty(
      'message',
      'The step with the given id is not associated to the route',
    );
  });
});
