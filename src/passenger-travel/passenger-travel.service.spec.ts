import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PassengerTravelEntity } from './passenger-travel.entity';
import { PassengerTravelService } from './passenger-travel.service';

describe('PassengerTravelService', () => {
  let service: PassengerTravelService;
  let repository: Repository<PassengerTravelEntity>;
  let passengerTravelsList: PassengerTravelEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PassengerTravelService],
    }).compile();

    service = module.get<PassengerTravelService>(PassengerTravelService);
    repository = module.get<Repository<PassengerTravelEntity>>(
      getRepositoryToken(PassengerTravelEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    passengerTravelsList = [];
    for (let i = 0; i < 5; i++) {
      const passengerTravel: PassengerTravelEntity = await repository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: faker.datatype.string(),
      });
      passengerTravelsList.push(passengerTravel);
    }
  };

  it('findAll should return all passengerTravels', async () => {
    const passengerTravels: PassengerTravelEntity[] = await service.findAll();
    expect(passengerTravels).not.toBeNull();
    expect(passengerTravels).toHaveLength(passengerTravelsList.length);
  });

  it('findOne should return a passengerTravel by id', async () => {
    const storedPassengerTravel: PassengerTravelEntity =
      passengerTravelsList[0];
    const passengerTravel: PassengerTravelEntity = await service.findOne(
      storedPassengerTravel.id,
    );
    expect(passengerTravel).not.toBeNull();
    expect(passengerTravel.cost).toEqual(storedPassengerTravel.cost);
    expect(passengerTravel.quota).toEqual(storedPassengerTravel.quota);
    expect(passengerTravel.date).toEqual(storedPassengerTravel.date);
    expect(passengerTravel.state).toEqual(storedPassengerTravel.state);
  });

  it('findOne should throw an exception for an invalid passengerTravel', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('create should return a new passengerTravel', async () => {
    const passengerTravel: PassengerTravelEntity = {
      id: '',
      cost: faker.datatype.number(50000),
      quota: faker.datatype.number(6),
      date: faker.date.soon(),
      state: faker.datatype.string(),
      driverTravel: null,
      passengers: null,
      origin: null,
      destination: null,
    };

    const newPassengerTravel: PassengerTravelEntity = await service.create(
      passengerTravel,
    );
    expect(newPassengerTravel).not.toBeNull();

    const storedPassengerTravel: PassengerTravelEntity =
      await repository.findOne({
        where: { id: newPassengerTravel.id },
      });
    expect(passengerTravel).not.toBeNull();
    expect(passengerTravel.date.getDate()).toBeGreaterThan(Date.now());
    expect(passengerTravel.quota).toBeGreaterThanOrEqual(0);
    expect(passengerTravel.quota).toBeLessThanOrEqual(7);
    expect(passengerTravel.cost).toBeGreaterThanOrEqual(0);
    expect(passengerTravel.cost).toEqual(storedPassengerTravel.cost);
    expect(passengerTravel.quota).toEqual(storedPassengerTravel.quota);
    expect(passengerTravel.date).toEqual(storedPassengerTravel.date);
    expect(passengerTravel.state).toEqual(storedPassengerTravel.state);
  });

  it('update should modify a passengerTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    passengerTravel.cost = faker.datatype.number(50000);
    passengerTravel.quota = faker.datatype.number(6);
    passengerTravel.date = faker.date.soon();
    passengerTravel.state = faker.datatype.string();
    const updatedPassengerTravel: PassengerTravelEntity = await service.update(
      passengerTravel.id,
      passengerTravel,
    );
    expect(updatedPassengerTravel).not.toBeNull();
    const storedPassengerTravel: PassengerTravelEntity =
      await repository.findOne({
        where: { id: passengerTravel.id },
      });
    expect(storedPassengerTravel).not.toBeNull();
    expect(storedPassengerTravel.date.getDate()).toBeGreaterThan(Date.now());
    expect(storedPassengerTravel.quota).toBeGreaterThanOrEqual(0);
    expect(storedPassengerTravel.quota).toBeLessThanOrEqual(7);
    expect(passengerTravel.cost).toBeGreaterThanOrEqual(0);
    expect(passengerTravel.cost).toEqual(storedPassengerTravel.cost);
    expect(passengerTravel.quota).toEqual(storedPassengerTravel.quota);
    expect(passengerTravel.date).toEqual(storedPassengerTravel.date);
    expect(passengerTravel.state).toEqual(storedPassengerTravel.state);
  });

  it('update should throw an exception for an invalid passengerTravel', async () => {
    let passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    passengerTravel = {
      ...passengerTravel,
      cost: faker.datatype.number(50000),
      quota: faker.datatype.number(6),
      date: faker.date.soon(),
      state: faker.datatype.string(),
    };
    await expect(() =>
      service.update('0', passengerTravel),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('delete should remove a passengerTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    await service.delete(passengerTravel.id);
    const deletedPassengerTravel: PassengerTravelEntity =
      await repository.findOne({
        where: { id: passengerTravel.id },
      });
    expect(deletedPassengerTravel).toBeNull();
  });

  it('delete should throw an exception for an invalid passengerTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    await service.delete(passengerTravel.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });
});
