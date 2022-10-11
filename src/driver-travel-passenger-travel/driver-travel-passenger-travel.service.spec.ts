import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DriverTravelPassengerTravelService } from './driver-travel-passenger-travel.service';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';

describe('DriverTravelPassengerTravelService', () => {
  let service: DriverTravelPassengerTravelService;
  let driverTravelRepository: Repository<DriverTravelEntity>;
  let passengerTravelRepository: Repository<PassengerTravelEntity>;
  let driverTravel: DriverTravelEntity;
  let passengerTravelsList: PassengerTravelEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DriverTravelPassengerTravelService],
    }).compile();

    service = module.get<DriverTravelPassengerTravelService>(
      DriverTravelPassengerTravelService,
    );
    driverTravelRepository = module.get<Repository<DriverTravelEntity>>(
      getRepositoryToken(DriverTravelEntity),
    );
    passengerTravelRepository = module.get<Repository<PassengerTravelEntity>>(
      getRepositoryToken(PassengerTravelEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    passengerTravelRepository.clear();
    driverTravelRepository.clear();

    passengerTravelsList = [];
    for (let i = 0; i < 5; i++) {
      const passengerTravel: PassengerTravelEntity =
        await passengerTravelRepository.save({
          cost: faker.datatype.number(50000),
          quota: faker.datatype.number(6),
          date: faker.date.soon(),
          state: 'OPEN',
        });
      passengerTravelsList.push(passengerTravel);
    }

    driverTravel = await driverTravelRepository.save({
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: 'OPEN',
      passengerTravels: passengerTravelsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPassengerTravelDriverTravel should add an passengerTravel to a driverTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    const result: DriverTravelEntity =
      await service.addPassengerTravelDriverTravel(
        newDriverTravel.id,
        newPassengerTravel.id,
      );

    expect(result.passengerTravels.length).toBe(1);
    expect(result.passengerTravels[0]).not.toBeNull();
    expect(result.passengerTravels[0].cost).toStrictEqual(
      newPassengerTravel.cost,
    );
    expect(result.passengerTravels[0].quota).toStrictEqual(
      newPassengerTravel.quota,
    );
    expect(result.passengerTravels[0].date).toStrictEqual(
      newPassengerTravel.date,
    );
    expect(result.passengerTravels[0].state).toStrictEqual(
      newPassengerTravel.state,
    );
  });

  it('addPassengerTravelDriverTravel should thrown exception for an invalid passengerTravel', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.addPassengerTravelDriverTravel(newDriverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('addPassengerTravelDriverTravel should throw an exception for an invalid driverTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.addPassengerTravelDriverTravel('0', newPassengerTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findPassengerTravelByDriverTravelIdPassengerTravelId should return passengerTravel by driverTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    const storedPassengerTravel: PassengerTravelEntity =
      await service.findPassengerTravelByDriverTravelIdPassengerTravelId(
        driverTravel.id,
        passengerTravel.id,
      );

    expect(storedPassengerTravel).not.toBeNull();
    expect(storedPassengerTravel.cost).toStrictEqual(passengerTravel.cost);
    expect(storedPassengerTravel.quota).toStrictEqual(passengerTravel.quota);
    expect(storedPassengerTravel.date).toStrictEqual(passengerTravel.date);
    expect(storedPassengerTravel.state).toStrictEqual(passengerTravel.state);
  });

  it('findPassengerTravelByDriverTravelIdPassengerTravelId should throw an exception for an invalid passengerTravel', async () => {
    await expect(() =>
      service.findPassengerTravelByDriverTravelIdPassengerTravelId(
        driverTravel.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('findPassengerTravelByDriverTravelIdPassengerTravelId should throw an exception for an invalid driverTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    await expect(() =>
      service.findPassengerTravelByDriverTravelIdPassengerTravelId(
        '0',
        passengerTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findPassengerTravelByDriverTravelIdPassengerTravelId should throw an exception for an passengerTravel not associated to the driverTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.findPassengerTravelByDriverTravelIdPassengerTravelId(
        driverTravel.id,
        newPassengerTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id is not associated to the driverTravel',
    );
  });

  it('findPassengerTravelsByDriverTravelId should return passengerTravels by driverTravel', async () => {
    const passengerTravels: PassengerTravelEntity[] =
      await service.findPassengerTravelsByDriverTravelId(driverTravel.id);
    expect(passengerTravels.length).toBe(5);
  });

  it('findPassengerTravelsByDriverTravelId should throw an exception for an invalid driverTravel', async () => {
    await expect(() =>
      service.findPassengerTravelsByDriverTravelId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associatePassengerTravelsDriverTravel should update passengerTravels list for a driverTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    const updatedDriverTravel: DriverTravelEntity =
      await service.associatePassengerTravelsDriverTravel(driverTravel.id, [
        newPassengerTravel,
      ]);
    expect(updatedDriverTravel.passengerTravels.length).toBe(1);
    expect(updatedDriverTravel.passengerTravels[0].cost).toStrictEqual(
      newPassengerTravel.cost,
    );
    expect(updatedDriverTravel.passengerTravels[0].quota).toStrictEqual(
      newPassengerTravel.quota,
    );
    expect(updatedDriverTravel.passengerTravels[0].date).toStrictEqual(
      newPassengerTravel.date,
    );
    expect(updatedDriverTravel.passengerTravels[0].state).toStrictEqual(
      newPassengerTravel.state,
    );
  });

  it('associatePassengerTravelsDriverTravel should throw an exception for an invalid driverTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.associatePassengerTravelsDriverTravel('0', [newPassengerTravel]),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associatePassengerTravelsDriverTravel should throw an exception for an invalid passengerTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    newPassengerTravel.id = '0';

    await expect(() =>
      service.associatePassengerTravelsDriverTravel(driverTravel.id, [
        newPassengerTravel,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('deletePassengerTravelToDriverTravel should remove an passengerTravel from a driverTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];

    await service.deletePassengerTravelDriverTravel(
      driverTravel.id,
      passengerTravel.id,
    );

    const storedDriverTravel: DriverTravelEntity =
      await driverTravelRepository.findOne({
        where: { id: driverTravel.id },
        relations: ['passengerTravels'],
      });
    const deletedPassengerTravel: PassengerTravelEntity =
      storedDriverTravel.passengerTravels.find(
        (a) => a.id === passengerTravel.id,
      );

    expect(deletedPassengerTravel).toBeUndefined();
  });

  it('deletePassengerTravelToDriverTravel should thrown an exception for an invalid passengerTravel', async () => {
    await expect(() =>
      service.deletePassengerTravelDriverTravel(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('deletePassengerTravelToDriverTravel should thrown an exception for an invalid driverTravel', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    await expect(() =>
      service.deletePassengerTravelDriverTravel('0', passengerTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('deletePassengerTravelToDriverTravel should thrown an exception for an non asocciated passengerTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.deletePassengerTravelDriverTravel(
        driverTravel.id,
        newPassengerTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id is not associated to the driverTravel',
    );
  });
});
