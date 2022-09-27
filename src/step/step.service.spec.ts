import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { StepEntity } from './step.entity';
import { StepService } from './step.service';

describe('StepService', () => {
  let service: StepService;
  let repository: Repository<StepEntity>;
  let stepsList: StepEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StepService],
    }).compile();

    service = module.get<StepService>(StepService);
    repository = module.get<Repository<StepEntity>>(
      getRepositoryToken(StepEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    stepsList = [];
    for (let i = 0; i < 5; i++) {
      const step: StepEntity = await repository.save({
        duration: faker.date.past().getMinutes(),
        distance: faker.datatype.number(1000),
      });
      stepsList.push(step);
    }
  };

  it('findAll should return all steps', async () => {
    const steps: StepEntity[] = await service.findAll();
    expect(steps).not.toBeNull();
    expect(steps).toHaveLength(stepsList.length);
  });

  it('findOne should return a step by id', async () => {
    const storedStep: StepEntity = stepsList[0];
    const step: StepEntity = await service.findOne(storedStep.id);
    expect(step).not.toBeNull();
    expect(step.distance).toEqual(storedStep.distance);
    expect(step.duration).toEqual(storedStep.duration);
  });

  it('findOne should throw an exception for an invalid step', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });

  it('create should return a new step', async () => {
    const step: StepEntity = {
      id: '',
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
      route: null,
      startPoint: null,
      endPoint: null,
    };

    const newStep: StepEntity = await service.create(step);
    expect(newStep).not.toBeNull();

    const storedStep: StepEntity = await repository.findOne({
      where: { id: newStep.id },
    });
    expect(step).not.toBeNull();
    expect(step.distance).toEqual(storedStep.distance);
    expect(step.duration).toEqual(storedStep.duration);
  });

  it('update should modify a step', async () => {
    const step: StepEntity = stepsList[0];
    step.duration = faker.date.past().getMinutes();
    step.distance = faker.datatype.number(1000);
    const updatedStep: StepEntity = await service.update(step.id, step);
    expect(updatedStep).not.toBeNull();
    const storedStep: StepEntity = await repository.findOne({
      where: { id: step.id },
    });
    expect(storedStep).not.toBeNull();
    expect(step.distance).toEqual(storedStep.distance);
    expect(step.duration).toEqual(storedStep.duration);
  });

  it('update should throw an exception for an invalid step', async () => {
    let step: StepEntity = stepsList[0];
    step = {
      ...step,
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    };
    await expect(() => service.update('0', step)).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });

  it('delete should remove a step', async () => {
    const step: StepEntity = stepsList[0];
    await service.delete(step.id);
    const deletedStep: StepEntity = await repository.findOne({
      where: { id: step.id },
    });
    expect(deletedStep).toBeNull();
  });

  it('delete should throw an exception for an invalid step', async () => {
    const step: StepEntity = stepsList[0];
    await service.delete(step.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The step with the given id was not found',
    );
  });
});
