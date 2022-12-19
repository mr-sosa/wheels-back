import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { DriverTravelEntity } from './driver-travel.entity';
import { DriverTravelService } from './driver-travel.service';

describe('DriverTravelService', () => {
  let service: DriverTravelService;
  let repository: Repository<DriverTravelEntity>;
  let driverTravelsList: DriverTravelEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DriverTravelService],
    }).compile();

    service = module.get<DriverTravelService>(DriverTravelService);
    repository = module.get<Repository<DriverTravelEntity>>(
      getRepositoryToken(DriverTravelEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    driverTravelsList = [];
    for (let i = 0; i < 5; i++) {
      const driverTravel: DriverTravelEntity = await repository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });
      driverTravelsList.push(driverTravel);
    }
  };

  it('findAll should return all driverTravels', async () => {
    const driverTravels: DriverTravelEntity[] = await service.findAll(
      undefined,
      'OPEN',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    expect(driverTravels).not.toBeNull();
    expect(driverTravels).toHaveLength(driverTravelsList.length);
  });

  it('findOne should return a driverTravel by id', async () => {
    const storedDriverTravel: DriverTravelEntity = driverTravelsList[0];
    const driverTravel: DriverTravelEntity = await service.findOne(
      storedDriverTravel.id,
    );
    expect(driverTravel).not.toBeNull();
    expect(driverTravel.date).toEqual(storedDriverTravel.date);
    expect(driverTravel.state).toEqual(storedDriverTravel.state);
    expect(driverTravel.spaceAvailable).toEqual(
      storedDriverTravel.spaceAvailable,
    );
  });

  it('findOne should throw an exception for an invalid driverTravel', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('create should return a new driverTravel', async () => {
    const driverTravel: DriverTravelEntity = {
      id: '',
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: 'OPEN',
      passengerTravels: null,
      vehicle: null,
      routes: null,
      driver: null,
      passengers: null,
      preferences: null,
      origin: null,
      destination: null,
    };

    const newDriverTravel: DriverTravelEntity = await service.create(
      driverTravel,
    );
    expect(newDriverTravel).not.toBeNull();

    const storedDriverTravel: DriverTravelEntity = await repository.findOne({
      where: { id: newDriverTravel.id },
    });
    expect(driverTravel).not.toBeNull();
    expect(driverTravel.date.getTime()).toBeGreaterThan(Date.now());
    expect(driverTravel.spaceAvailable).toBeGreaterThanOrEqual(0);
    expect(driverTravel.spaceAvailable).toBeLessThanOrEqual(7);
    expect(driverTravel.date).toEqual(storedDriverTravel.date);
    expect(driverTravel.state).toEqual(storedDriverTravel.state);
    expect(driverTravel.spaceAvailable).toEqual(
      storedDriverTravel.spaceAvailable,
    );
  });
  /*
  it('update should throw an exception for an invalid state of passengerTravel', async () => {
    const driverTravel: DriverTravelEntity = {
      id: '',
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: faker.datatype.string(),
      passengerTravels: null,
      vehicle: null,
      routes: null,
      driver: null,
      passengers: null,
      preferences: null,
      origin: null,
      destination: null,
    };

    await expect(() => service.create(driverTravel)).rejects.toHaveProperty(
      'message',
      'Invalid state of driverTravel',
    );
  });
*/
  it('update should modify a driverTravel', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];
    driverTravel.date = faker.date.soon();
    driverTravel.spaceAvailable = faker.datatype.number(6);
    driverTravel.state = 'OPEN';
    const updatedDriverTravel: DriverTravelEntity = await service.update(
      driverTravel.id,
      driverTravel,
    );
    expect(updatedDriverTravel).not.toBeNull();
    const storedDriverTravel: DriverTravelEntity = await repository.findOne({
      where: { id: driverTravel.id },
    });
    expect(storedDriverTravel).not.toBeNull();
    expect(storedDriverTravel.date.getTime()).toBeGreaterThan(Date.now());
    expect(storedDriverTravel.spaceAvailable).toBeGreaterThanOrEqual(0);
    expect(storedDriverTravel.spaceAvailable).toBeLessThanOrEqual(7);
    expect(driverTravel.date).toEqual(storedDriverTravel.date);
    expect(driverTravel.state).toEqual(storedDriverTravel.state);
    expect(driverTravel.spaceAvailable).toEqual(
      storedDriverTravel.spaceAvailable,
    );
  });

  it('update should throw an exception for an invalid driverTravel', async () => {
    let driverTravel: DriverTravelEntity = driverTravelsList[0];
    driverTravel = {
      ...driverTravel,
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: 'OPEN',
    };
    await expect(() =>
      service.update('0', driverTravel),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid state of passengerTravel', async () => {
    let driverTravel: DriverTravelEntity = driverTravelsList[0];
    driverTravel = {
      ...driverTravel,
      state: faker.datatype.string(),
    };
    await expect(() =>
      service.update(driverTravel.id, driverTravel),
    ).rejects.toHaveProperty('message', 'Invalid state of driverTravel');
  });

  it('delete should remove a driverTravel', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];
    await service.delete(driverTravel.id);
    const deletedDriverTravel: DriverTravelEntity = await repository.findOne({
      where: { id: driverTravel.id },
    });
    expect(deletedDriverTravel).toBeNull();
  });

  it('delete should throw an exception for an invalid driverTravel', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];
    await service.delete(driverTravel.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });
});
