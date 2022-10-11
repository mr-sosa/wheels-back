import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DriverTravelRouteService } from './driver-travel-route.service';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { RouteEntity } from '../route/route.entity';

describe('DriverTravelRouteService', () => {
  let service: DriverTravelRouteService;
  let driverTravelRepository: Repository<DriverTravelEntity>;
  let routeRepository: Repository<RouteEntity>;
  let driverTravel: DriverTravelEntity;
  let routesList: RouteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DriverTravelRouteService],
    }).compile();

    service = module.get<DriverTravelRouteService>(DriverTravelRouteService);
    driverTravelRepository = module.get<Repository<DriverTravelEntity>>(
      getRepositoryToken(DriverTravelEntity),
    );
    routeRepository = module.get<Repository<RouteEntity>>(
      getRepositoryToken(RouteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    routeRepository.clear();
    driverTravelRepository.clear();

    routesList = [];
    for (let i = 0; i < 5; i++) {
      const route: RouteEntity = await routeRepository.save({
        duration: faker.date.past().getMinutes(),
        distance: faker.datatype.number(1000),
      });
      routesList.push(route);
    }

    driverTravel = await driverTravelRepository.save({
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: 'OPEN',
      routes: routesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRouteDriverTravel should add an route to a driverTravel', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    const result: DriverTravelEntity = await service.addRouteDriverTravel(
      newDriverTravel.id,
      newRoute.id,
    );

    expect(result.routes.length).toBe(1);
    expect(result.routes[0]).not.toBeNull();
    expect(result.routes[0].distance).toStrictEqual(newRoute.distance);
    expect(result.routes[0].duration).toStrictEqual(newRoute.duration);
  });

  it('addRouteDriverTravel should thrown exception for an invalid route', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.addRouteDriverTravel(newDriverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('addRouteDriverTravel should throw an exception for an invalid driverTravel', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.addRouteDriverTravel('0', newRoute.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findRouteByDriverTravelIdRouteId should return route by driverTravel', async () => {
    const route: RouteEntity = routesList[0];
    const storedRoute: RouteEntity =
      await service.findRouteByDriverTravelIdRouteId(driverTravel.id, route.id);

    expect(storedRoute).not.toBeNull();
    expect(storedRoute.distance).toStrictEqual(route.distance);
    expect(storedRoute.duration).toStrictEqual(route.duration);
  });

  it('findRouteByDriverTravelIdRouteId should throw an exception for an invalid route', async () => {
    await expect(() =>
      service.findRouteByDriverTravelIdRouteId(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('findRouteByDriverTravelIdRouteId should throw an exception for an invalid driverTravel', async () => {
    const route: RouteEntity = routesList[0];
    await expect(() =>
      service.findRouteByDriverTravelIdRouteId('0', route.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findRouteByDriverTravelIdRouteId should throw an exception for an route not associated to the driverTravel', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.findRouteByDriverTravelIdRouteId(driverTravel.id, newRoute.id),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id is not associated to the driverTravel',
    );
  });

  it('findRoutesByDriverTravelId should return routes by driverTravel', async () => {
    const routes: RouteEntity[] = await service.findRoutesByDriverTravelId(
      driverTravel.id,
    );
    expect(routes.length).toBe(5);
  });

  it('findRoutesByDriverTravelId should throw an exception for an invalid driverTravel', async () => {
    await expect(() =>
      service.findRoutesByDriverTravelId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associateRoutesDriverTravel should update routes list for a driverTravel', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    const updatedDriverTravel: DriverTravelEntity =
      await service.associateRoutesDriverTravel(driverTravel.id, [newRoute]);
    expect(updatedDriverTravel.routes.length).toBe(1);
    expect(updatedDriverTravel.routes[0].distance).toStrictEqual(
      newRoute.distance,
    );
    expect(updatedDriverTravel.routes[0].duration).toStrictEqual(
      newRoute.duration,
    );
  });

  it('associateRoutesDriverTravel should throw an exception for an invalid driverTravel', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.associateRoutesDriverTravel('0', [newRoute]),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associateRoutesDriverTravel should throw an exception for an invalid route', async () => {
    const newRoute: RouteEntity = routesList[0];
    newRoute.id = '0';

    await expect(() =>
      service.associateRoutesDriverTravel(driverTravel.id, [newRoute]),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('deleteRouteToDriverTravel should remove an route from a driverTravel', async () => {
    const route: RouteEntity = routesList[0];

    await service.deleteRouteDriverTravel(driverTravel.id, route.id);

    const storedDriverTravel: DriverTravelEntity =
      await driverTravelRepository.findOne({
        where: { id: driverTravel.id },
        relations: ['routes'],
      });
    const deletedRoute: RouteEntity = storedDriverTravel.routes.find(
      (a) => a.id === route.id,
    );

    expect(deletedRoute).toBeUndefined();
  });

  it('deleteRouteToDriverTravel should thrown an exception for an invalid route', async () => {
    await expect(() =>
      service.deleteRouteDriverTravel(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id was not found',
    );
  });

  it('deleteRouteToDriverTravel should thrown an exception for an invalid driverTravel', async () => {
    const route: RouteEntity = routesList[0];
    await expect(() =>
      service.deleteRouteDriverTravel('0', route.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('deleteRouteToDriverTravel should thrown an exception for an non asocciated route', async () => {
    const newRoute: RouteEntity = await routeRepository.save({
      duration: faker.date.past().getMinutes(),
      distance: faker.datatype.number(1000),
    });

    await expect(() =>
      service.deleteRouteDriverTravel(driverTravel.id, newRoute.id),
    ).rejects.toHaveProperty(
      'message',
      'The route with the given id is not associated to the driverTravel',
    );
  });
});
