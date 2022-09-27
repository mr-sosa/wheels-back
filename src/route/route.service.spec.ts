import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RouteEntity } from './route.entity';
import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;
  let repository: Repository<RouteEntity>;
  let routesList: RouteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RouteService],
    }).compile();

    service = module.get<RouteService>(RouteService);
    repository = module.get<Repository<RouteEntity>>(
      getRepositoryToken(RouteEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    routesList = [];
    for (let i = 0; i < 5; i++) {
      const route: RouteEntity = await repository.save({
        duration: faker.date.past().getMinutes(),
        distance: faker.datatype.number(1000),
      });
      routesList.push(route);
    }
  };

  it('findAll should return all routes', async () => {
    const routes: RouteEntity[] = await service.findAll();
    expect(routes).not.toBeNull();
    expect(routes).toHaveLength(routesList.length);
  });

  it('findOne should return a route by id', async () => {
    const storedRoute: RouteEntity = routesList[0];
    const route: RouteEntity = await service.findOne(storedRoute.id);
    expect(route).not.toBeNull();
    expect(route.distance).toEqual(storedRoute.distance);
    expect(route.duration).toEqual(storedRoute.duration);
  });

  it('findOne should throw an exception for an invalid route', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('create should return a new route', async () => {
    const route: RouteEntity = {
      id: '',
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
      driverTravel: null,
      steps: null,
    };

    const newRoute: RouteEntity = await service.create(route);
    expect(newRoute).not.toBeNull();

    const storedRoute: RouteEntity = await repository.findOne({
      where: { id: newRoute.id },
    });
    expect(route).not.toBeNull();
    expect(route.distance).toEqual(storedRoute.distance);
    expect(route.duration).toEqual(storedRoute.duration);
  });

  it('update should modify a route', async () => {
    const route: RouteEntity = routesList[0];
    route.duration = faker.date.past().getMinutes();
    route.distance = faker.datatype.number(1000);
    const updatedRoute: RouteEntity = await service.update(route.id, route);
    expect(updatedRoute).not.toBeNull();
    const storedRoute: RouteEntity = await repository.findOne({
      where: { id: route.id },
    });
    expect(storedRoute).not.toBeNull();
    expect(route.distance).toEqual(storedRoute.distance);
    expect(route.duration).toEqual(storedRoute.duration);
  });

  it('update should throw an exception for an invalid route', async () => {
    let route: RouteEntity = routesList[0];
    route = {
      ...route,
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    };
    await expect(() => service.update('0', route)).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('delete should remove a route', async () => {
    const route: RouteEntity = routesList[0];
    await service.delete(route.id);
    const deletedRoute: RouteEntity = await repository.findOne({
      where: { id: route.id },
    });
    expect(deletedRoute).toBeNull();
  });

  it('delete should throw an exception for an invalid route', async () => {
    const route: RouteEntity = routesList[0];
    await service.delete(route.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });
});
