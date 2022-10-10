import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserDriverTravelByDriverService } from './user-driver-travel-by-driver.service';
import { UserEntity } from '../user/user.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

describe('UserDriverTravelByDriverService', () => {
  let service: UserDriverTravelByDriverService;
  let userRepository: Repository<UserEntity>;
  let driverTravelRepository: Repository<DriverTravelEntity>;
  let user: UserEntity;
  let driverTravelsList: DriverTravelEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserDriverTravelByDriverService],
    }).compile();

    service = module.get<UserDriverTravelByDriverService>(
      UserDriverTravelByDriverService,
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    driverTravelRepository = module.get<Repository<DriverTravelEntity>>(
      getRepositoryToken(DriverTravelEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    driverTravelRepository.clear();
    userRepository.clear();

    driverTravelsList = [];
    for (let i = 0; i < 5; i++) {
      const driverTravel: DriverTravelEntity =
        await driverTravelRepository.save({
          date: faker.date.soon(),
          spaceAvailable: faker.datatype.number(6),
          state: 'OPEN',
        });
      driverTravelsList.push(driverTravel);
    }

    user = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: true,
      driverTravelsByDriver: driverTravelsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDriverTravelUser should add an driverTravel to a user', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    const newUser: UserEntity = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: true,
    });

    const result: UserEntity = await service.addDriverTravelByDriverUser(
      newUser.id,
      newDriverTravel.id,
    );

    expect(result.driverTravelsByDriver.length).toBe(1);
    expect(result.driverTravelsByDriver[0]).not.toBeNull();
    expect(result.driverTravelsByDriver[0].date).toEqual(newDriverTravel.date);
    expect(result.driverTravelsByDriver[0].spaceAvailable).toEqual(
      newDriverTravel.spaceAvailable,
    );
    expect(result.driverTravelsByDriver[0].state).toEqual(
      newDriverTravel.state,
    );
  });

  it('addDriverTravelUser should thrown exception for an invalid driverTravel', async () => {
    const newUser: UserEntity = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: true,
    });

    await expect(() =>
      service.addDriverTravelByDriverUser(newUser.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('addDriverTravelUser should throw an exception for an invalid user', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.addDriverTravelByDriverUser('0', newDriverTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('addDriverTravelUser should throw an exception for not driver user', async () => {
    let newUser = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: false,
    });

    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.addDriverTravelByDriverUser(newUser.id, newDriverTravel.id),
    ).rejects.toHaveProperty('message', 'The user is not a driver');
  });

  it('findDriverTravelByUserIdDriverTravelId should return driverTravel by user', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];
    const storedDriverTravel: DriverTravelEntity =
      await service.findDriverTravelByDriverByUserIdDriverTravelByDriverId(
        user.id,
        driverTravel.id,
      );

    expect(storedDriverTravel).not.toBeNull();
    expect(driverTravel.date).toEqual(storedDriverTravel.date);
    expect(driverTravel.spaceAvailable).toEqual(
      storedDriverTravel.spaceAvailable,
    );
    expect(driverTravel.state).toEqual(storedDriverTravel.state);
  });

  it('findDriverTravelByUserIdDriverTravelId should throw an exception for an invalid driverTravel', async () => {
    await expect(() =>
      service.findDriverTravelByDriverByUserIdDriverTravelByDriverId(
        user.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findDriverTravelByUserIdDriverTravelId should throw an exception for an invalid user', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];
    await expect(() =>
      service.findDriverTravelByDriverByUserIdDriverTravelByDriverId(
        '0',
        driverTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findDriverTravelByUserIdDriverTravelId should throw an exception for an driverTravel not associated to the user', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.findDriverTravelByDriverByUserIdDriverTravelByDriverId(
        user.id,
        newDriverTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id is not associated to the user',
    );
  });

  it('findDriverTravelsByUserId should return driverTravels by user', async () => {
    const driverTravels: DriverTravelEntity[] =
      await service.findDriverTravelByDriversByUserId(user.id);
    expect(driverTravels.length).toBe(5);
  });

  it('findDriverTravelsByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findDriverTravelByDriversByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateDriverTravelsUser should update driverTravels list for a user', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    const updatedUser: UserEntity =
      await service.associateDriverTravelByDriversUser(user.id, [
        newDriverTravel,
      ]);
    expect(updatedUser.driverTravelsByDriver.length).toBe(1);
    expect(updatedUser.driverTravelsByDriver[0].date).toEqual(
      newDriverTravel.date,
    );
    expect(updatedUser.driverTravelsByDriver[0].spaceAvailable).toEqual(
      newDriverTravel.spaceAvailable,
    );
    expect(updatedUser.driverTravelsByDriver[0].state).toEqual(
      newDriverTravel.state,
    );
  });

  it('associateDriverTravelsUser should throw an exception for an invalid user', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.associateDriverTravelByDriversUser('0', [newDriverTravel]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateDriverTravelsUser should throw an exception for an invalid driverTravel', async () => {
    const newDriverTravel: DriverTravelEntity = driverTravelsList[0];
    newDriverTravel.id = '0';

    await expect(() =>
      service.associateDriverTravelByDriversUser(user.id, [newDriverTravel]),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associateDriverTravelsUser should throw an exception for not driver user', async () => {
    let newUser = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: false,
    });

    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.associateDriverTravelByDriversUser(newUser.id, [newDriverTravel]),
    ).rejects.toHaveProperty('message', 'The user is not a driver');
  });

  it('deleteDriverTravelToUser should remove an driverTravel from a user', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];

    await service.deleteDriverTravelByDriverUser(user.id, driverTravel.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['driverTravelsByDriver'],
    });
    const deletedDriverTravel: DriverTravelEntity =
      storedUser.driverTravelsByDriver.find((a) => a.id === driverTravel.id);

    expect(deletedDriverTravel).toBeUndefined();
  });

  it('deleteDriverTravelToUser should thrown an exception for an invalid driverTravel', async () => {
    await expect(() =>
      service.deleteDriverTravelByDriverUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('deleteDriverTravelToUser should thrown an exception for an invalid user', async () => {
    const driverTravel: DriverTravelEntity = driverTravelsList[0];
    await expect(() =>
      service.deleteDriverTravelByDriverUser('0', driverTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteDriverTravelToUser should thrown an exception for an non asocciated driverTravel', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.deleteDriverTravelByDriverUser(user.id, newDriverTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id is not associated to the user',
    );
  });
});
