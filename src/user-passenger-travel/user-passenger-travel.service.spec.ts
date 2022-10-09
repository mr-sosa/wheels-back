import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserPassengerTravelService } from './user-passenger-travel.service';
import { UserEntity } from '../user/user.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';

describe('UserPassengerTravelService', () => {
  let service: UserPassengerTravelService;
  let userRepository: Repository<UserEntity>;
  let passengerTravelRepository: Repository<PassengerTravelEntity>;
  let user: UserEntity;
  let passengerTravelsList: PassengerTravelEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserPassengerTravelService],
    }).compile();

    service = module.get<UserPassengerTravelService>(
      UserPassengerTravelService,
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    passengerTravelRepository = module.get<Repository<PassengerTravelEntity>>(
      getRepositoryToken(PassengerTravelEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    passengerTravelRepository.clear();
    userRepository.clear();

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
      passengerTravels: passengerTravelsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPassengerTravelUser should add an passengerTravel to a user', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
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

    const result: UserEntity = await service.addPassengerTravelUser(
      newUser.id,
      newPassengerTravel.id,
    );

    expect(result.passengerTravels.length).toBe(1);
    expect(result.passengerTravels[0]).not.toBeNull();
    expect(result.passengerTravels[0].cost).toEqual(newPassengerTravel.cost);
    expect(result.passengerTravels[0].quota).toEqual(newPassengerTravel.quota);
    expect(result.passengerTravels[0].date).toEqual(newPassengerTravel.date);
    expect(result.passengerTravels[0].state).toEqual(newPassengerTravel.state);
  });

  it('addPassengerTravelUser should thrown exception for an invalid passengerTravel', async () => {
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
      isDriver: false,
    });

    await expect(() =>
      service.addPassengerTravelUser(newUser.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('addPassengerTravelUser should throw an exception for an invalid user', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.addPassengerTravelUser('0', newPassengerTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findPassengerTravelByUserIdPassengerTravelId should return passengerTravel by user', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    const storedPassengerTravel: PassengerTravelEntity =
      await service.findPassengerTravelByUserIdPassengerTravelId(
        user.id,
        passengerTravel.id,
      );

    expect(storedPassengerTravel).not.toBeNull();
    expect(passengerTravel.cost).toEqual(storedPassengerTravel.cost);
    expect(passengerTravel.quota).toEqual(storedPassengerTravel.quota);
    expect(passengerTravel.date).toEqual(storedPassengerTravel.date);
    expect(passengerTravel.state).toEqual(storedPassengerTravel.state);
  });

  it('findPassengerTravelByUserIdPassengerTravelId should throw an exception for an invalid passengerTravel', async () => {
    await expect(() =>
      service.findPassengerTravelByUserIdPassengerTravelId(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('findPassengerTravelByUserIdPassengerTravelId should throw an exception for an invalid user', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    await expect(() =>
      service.findPassengerTravelByUserIdPassengerTravelId(
        '0',
        passengerTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findPassengerTravelByUserIdPassengerTravelId should throw an exception for an passengerTravel not associated to the user', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.findPassengerTravelByUserIdPassengerTravelId(
        user.id,
        newPassengerTravel.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id is not associated to the user',
    );
  });

  it('findPassengerTravelsByUserId should return passengerTravels by user', async () => {
    const passengerTravels: PassengerTravelEntity[] =
      await service.findPassengerTravelsByUserId(user.id);
    expect(passengerTravels.length).toBe(5);
  });

  it('findPassengerTravelsByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findPassengerTravelsByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associatePassengerTravelsUser should update passengerTravels list for a user', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    const updatedUser: UserEntity = await service.associatePassengerTravelsUser(
      user.id,
      [newPassengerTravel],
    );
    expect(updatedUser.passengerTravels.length).toBe(1);
    expect(updatedUser.passengerTravels[0].cost).toEqual(
      newPassengerTravel.cost,
    );
    expect(updatedUser.passengerTravels[0].quota).toEqual(
      newPassengerTravel.quota,
    );
    expect(updatedUser.passengerTravels[0].date).toEqual(
      newPassengerTravel.date,
    );
    expect(updatedUser.passengerTravels[0].state).toEqual(
      newPassengerTravel.state,
    );
  });

  it('associatePassengerTravelsUser should throw an exception for an invalid user', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.associatePassengerTravelsUser('0', [newPassengerTravel]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associatePassengerTravelsUser should throw an exception for an invalid passengerTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    newPassengerTravel.id = '0';

    await expect(() =>
      service.associatePassengerTravelsUser(user.id, [newPassengerTravel]),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('deletePassengerTravelToUser should remove an passengerTravel from a user', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];

    await service.deletePassengerTravelUser(user.id, passengerTravel.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['passengerTravels'],
    });
    const deletedPassengerTravel: PassengerTravelEntity =
      storedUser.passengerTravels.find((a) => a.id === passengerTravel.id);

    expect(deletedPassengerTravel).toBeUndefined();
  });

  it('deletePassengerTravelToUser should thrown an exception for an invalid passengerTravel', async () => {
    await expect(() =>
      service.deletePassengerTravelUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('deletePassengerTravelToUser should thrown an exception for an invalid user', async () => {
    const passengerTravel: PassengerTravelEntity = passengerTravelsList[0];
    await expect(() =>
      service.deletePassengerTravelUser('0', passengerTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deletePassengerTravelToUser should thrown an exception for an non asocciated passengerTravel', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.deletePassengerTravelUser(user.id, newPassengerTravel.id),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id is not associated to the user',
    );
  });
});
