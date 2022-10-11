import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DriverTravelUserService } from './driver-travel-user.service';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { UserEntity } from '../user/user.entity';

describe('DriverTravelUserService', () => {
  let service: DriverTravelUserService;
  let driverTravelRepository: Repository<DriverTravelEntity>;
  let userRepository: Repository<UserEntity>;
  let driverTravel: DriverTravelEntity;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DriverTravelUserService],
    }).compile();

    service = module.get<DriverTravelUserService>(DriverTravelUserService);
    driverTravelRepository = module.get<Repository<DriverTravelEntity>>(
      getRepositoryToken(DriverTravelEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    userRepository.clear();
    driverTravelRepository.clear();

    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await userRepository.save({
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
        isDriver: faker.datatype.boolean(),
        state: 'ACTIVE',
        verifiedMail: faker.datatype.boolean(),
        verifiedPhone: faker.datatype.boolean(),
        verifiedIC: faker.datatype.boolean(),
        verifiedDrivingPass: faker.datatype.boolean(),
        verifiedUser: false,
      });
      usersList.push(user);
    }

    driverTravel = await driverTravelRepository.save({
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: 'OPEN',
      passengers: usersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUserDriverTravel should add an user to a driverTravel', async () => {
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
      isDriver: faker.datatype.boolean(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    });

    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    const result: DriverTravelEntity = await service.addUserDriverTravel(
      newDriverTravel.id,
      newUser.id,
    );

    expect(result.passengers.length).toBe(1);
    expect(result.passengers[0]).not.toBeNull();
    expect(result.passengers[0].email).toStrictEqual(newUser.email);
    expect(result.passengers[0].password).toEqual(newUser.password);
    expect(result.passengers[0].name).toEqual(newUser.name);
    expect(result.passengers[0].phone).toEqual(newUser.phone);
    expect(result.passengers[0].genre).toEqual(newUser.genre);
    expect(result.passengers[0].birthDate).toEqual(newUser.birthDate);
    expect(result.passengers[0].photo).toEqual(newUser.photo);
    expect(result.passengers[0].idenficiationCard).toEqual(
      newUser.idenficiationCard,
    );
    expect(result.passengers[0].about).toEqual(newUser.about);
    expect(result.passengers[0].score).toEqual(newUser.score);
    expect(result.passengers[0].drivingPass).toEqual(newUser.drivingPass);
    expect(result.passengers[0].isDriver).toEqual(newUser.isDriver);
    expect(result.passengers[0].state).toEqual(newUser.state);
    expect(result.passengers[0].verifiedMail).toEqual(newUser.verifiedMail);
    expect(result.passengers[0].verifiedPhone).toEqual(newUser.verifiedPhone);
    expect(result.passengers[0].verifiedIC).toEqual(newUser.verifiedIC);
    expect(result.passengers[0].verifiedDrivingPass).toEqual(
      newUser.verifiedDrivingPass,
    );
    expect(result.passengers[0].verifiedUser).toEqual(newUser.verifiedUser);
  });

  it('addUserDriverTravel should thrown exception for an invalid user', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.addUserDriverTravel(newDriverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('addUserDriverTravel should throw an exception for an invalid driverTravel', async () => {
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
      isDriver: faker.datatype.boolean(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    });

    await expect(() =>
      service.addUserDriverTravel('0', newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findUserByDriverTravelIdUserId should return user by driverTravel', async () => {
    const user: UserEntity = usersList[0];
    const storedUser: UserEntity = await service.findUserByDriverTravelIdUserId(
      driverTravel.id,
      user.id,
    );

    expect(storedUser).not.toBeNull();
    expect(user.email).toEqual(storedUser.email);
    expect(user.password).toEqual(storedUser.password);
    expect(user.name).toEqual(storedUser.name);
    expect(user.phone).toEqual(storedUser.phone);
    expect(user.genre).toEqual(storedUser.genre);
    expect(user.birthDate).toEqual(storedUser.birthDate);
    expect(user.photo).toEqual(storedUser.photo);
    expect(user.idenficiationCard).toEqual(storedUser.idenficiationCard);
    expect(user.about).toEqual(storedUser.about);
    expect(user.score).toEqual(storedUser.score);
    expect(user.drivingPass).toEqual(storedUser.drivingPass);
    expect(user.isDriver).toEqual(storedUser.isDriver);
    expect(user.state).toEqual(storedUser.state);
    expect(user.verifiedMail).toEqual(storedUser.verifiedMail);
    expect(user.verifiedPhone).toEqual(storedUser.verifiedPhone);
    expect(user.verifiedIC).toEqual(storedUser.verifiedIC);
    expect(user.verifiedDrivingPass).toEqual(storedUser.verifiedDrivingPass);
    expect(user.verifiedUser).toEqual(storedUser.verifiedUser);
  });

  it('findUserByDriverTravelIdUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findUserByDriverTravelIdUserId(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findUserByDriverTravelIdUserId should throw an exception for an invalid driverTravel', async () => {
    const user: UserEntity = usersList[0];
    await expect(() =>
      service.findUserByDriverTravelIdUserId('0', user.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findUserByDriverTravelIdUserId should throw an exception for an user not associated to the driverTravel', async () => {
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
      isDriver: faker.datatype.boolean(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    });

    await expect(() =>
      service.findUserByDriverTravelIdUserId(driverTravel.id, newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id is not associated to the driverTravel',
    );
  });

  it('findUsersByDriverTravelId should return users by driverTravel', async () => {
    const users: UserEntity[] = await service.findUsersByDriverTravelId(
      driverTravel.id,
    );
    expect(users.length).toBe(5);
  });

  it('findUsersByDriverTravelId should throw an exception for an invalid driverTravel', async () => {
    await expect(() =>
      service.findUsersByDriverTravelId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associateUsersDriverTravel should update users list for a driverTravel', async () => {
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
      isDriver: faker.datatype.boolean(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    });

    const updatedDriverTravel: DriverTravelEntity =
      await service.associateUsersDriverTravel(driverTravel.id, [newUser]);
    expect(updatedDriverTravel.passengers.length).toBe(1);
    expect(updatedDriverTravel.passengers[0].email).toStrictEqual(
      newUser.email,
    );
    expect(updatedDriverTravel.passengers[0].password).toEqual(
      newUser.password,
    );
    expect(updatedDriverTravel.passengers[0].name).toEqual(newUser.name);
    expect(updatedDriverTravel.passengers[0].phone).toEqual(newUser.phone);
    expect(updatedDriverTravel.passengers[0].genre).toEqual(newUser.genre);
    expect(updatedDriverTravel.passengers[0].birthDate).toEqual(
      newUser.birthDate,
    );
    expect(updatedDriverTravel.passengers[0].photo).toEqual(newUser.photo);
    expect(updatedDriverTravel.passengers[0].idenficiationCard).toEqual(
      newUser.idenficiationCard,
    );
    expect(updatedDriverTravel.passengers[0].about).toEqual(newUser.about);
    expect(updatedDriverTravel.passengers[0].score).toEqual(newUser.score);
    expect(updatedDriverTravel.passengers[0].drivingPass).toEqual(
      newUser.drivingPass,
    );
    expect(updatedDriverTravel.passengers[0].isDriver).toEqual(
      newUser.isDriver,
    );
    expect(updatedDriverTravel.passengers[0].state).toEqual(newUser.state);
    expect(updatedDriverTravel.passengers[0].verifiedMail).toEqual(
      newUser.verifiedMail,
    );
    expect(updatedDriverTravel.passengers[0].verifiedPhone).toEqual(
      newUser.verifiedPhone,
    );
    expect(updatedDriverTravel.passengers[0].verifiedIC).toEqual(
      newUser.verifiedIC,
    );
    expect(updatedDriverTravel.passengers[0].verifiedDrivingPass).toEqual(
      newUser.verifiedDrivingPass,
    );
    expect(updatedDriverTravel.passengers[0].verifiedUser).toEqual(
      newUser.verifiedUser,
    );
  });

  it('associateUsersDriverTravel should throw an exception for an invalid driverTravel', async () => {
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
      isDriver: faker.datatype.boolean(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    });

    await expect(() =>
      service.associateUsersDriverTravel('0', [newUser]),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associateUsersDriverTravel should throw an exception for an invalid user', async () => {
    const newUser: UserEntity = usersList[0];
    newUser.id = '0';

    await expect(() =>
      service.associateUsersDriverTravel(driverTravel.id, [newUser]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteUserToDriverTravel should remove an user from a driverTravel', async () => {
    const user: UserEntity = usersList[0];

    await service.deleteUserDriverTravel(driverTravel.id, user.id);

    const storedDriverTravel: DriverTravelEntity =
      await driverTravelRepository.findOne({
        where: { id: driverTravel.id },
        relations: ['passengers'],
      });
    const deletedUser: UserEntity = storedDriverTravel.passengers.find(
      (a) => a.id === user.id,
    );

    expect(deletedUser).toBeUndefined();
  });

  it('deleteUserToDriverTravel should thrown an exception for an invalid user', async () => {
    await expect(() =>
      service.deleteUserDriverTravel(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteUserToDriverTravel should thrown an exception for an invalid driverTravel', async () => {
    const user: UserEntity = usersList[0];
    await expect(() =>
      service.deleteUserDriverTravel('0', user.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('deleteUserToDriverTravel should thrown an exception for an non asocciated user', async () => {
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
      isDriver: faker.datatype.boolean(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    });

    await expect(() =>
      service.deleteUserDriverTravel(driverTravel.id, newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id is not associated to the driverTravel',
    );
  });
});
