import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PassengerTravelUserService } from './passenger-travel-user.service';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { UserEntity } from '../user/user.entity';

describe('PassengerTravelUserService', () => {
  let service: PassengerTravelUserService;
  let passengerTravelRepository: Repository<PassengerTravelEntity>;
  let userRepository: Repository<UserEntity>;
  let passengerTravel: PassengerTravelEntity;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PassengerTravelUserService],
    }).compile();

    service = module.get<PassengerTravelUserService>(
      PassengerTravelUserService,
    );
    passengerTravelRepository = module.get<Repository<PassengerTravelEntity>>(
      getRepositoryToken(PassengerTravelEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    userRepository.clear();
    passengerTravelRepository.clear();

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
        state: 'ACTIVE',
        verifiedMail: faker.datatype.boolean(),
        verifiedPhone: faker.datatype.boolean(),
        verifiedIC: faker.datatype.boolean(),
        verifiedDrivingPass: faker.datatype.boolean(),
        verifiedPassengerTravel: false,
        verifiedUser: false,
        isDriver: true,
      });
      usersList.push(user);
    }

    passengerTravel = await passengerTravelRepository.save({
      cost: faker.datatype.number(50000),
      quota: faker.datatype.number(6),
      date: faker.date.soon(),
      state: 'OPEN',
      passengers: usersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUserPassengerTravel should add an user to a passengerTravel', async () => {
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
      verifiedPassengerTravel: false,
      verifiedUser: false,
      isDriver: true,
    });

    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    const result: PassengerTravelEntity = await service.addUserPassengerTravel(
      newPassengerTravel.id,
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

  it('addUserPassengerTravel should thrown exception for an invalid user', async () => {
    const newPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.save({
        cost: faker.datatype.number(50000),
        quota: faker.datatype.number(6),
        date: faker.date.soon(),
        state: 'OPEN',
      });

    await expect(() =>
      service.addUserPassengerTravel(newPassengerTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('addUserPassengerTravel should throw an exception for an invalid passengerTravel', async () => {
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
      verifiedPassengerTravel: false,
      verifiedUser: false,
      isDriver: true,
    });

    await expect(() =>
      service.addUserPassengerTravel('0', newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('findUserByPassengerTravelIdUserId should return user by passengerTravel', async () => {
    const user: UserEntity = usersList[0];
    const storedUser: UserEntity =
      await service.findUserByPassengerTravelIdUserId(
        passengerTravel.id,
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

  it('findUserByPassengerTravelIdUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findUserByPassengerTravelIdUserId(passengerTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findUserByPassengerTravelIdUserId should throw an exception for an invalid passengerTravel', async () => {
    const user: UserEntity = usersList[0];
    await expect(() =>
      service.findUserByPassengerTravelIdUserId('0', user.id),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('findUserByPassengerTravelIdUserId should throw an exception for an user not associated to the passengerTravel', async () => {
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
      verifiedPassengerTravel: false,
      verifiedUser: false,
      isDriver: true,
    });

    await expect(() =>
      service.findUserByPassengerTravelIdUserId(passengerTravel.id, newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id is not associated to the passengerTravel',
    );
  });

  it('findUsersByPassengerTravelId should return users by passengerTravel', async () => {
    const users: UserEntity[] = await service.findUsersByPassengerTravelId(
      passengerTravel.id,
    );
    expect(users.length).toBe(5);
  });

  it('findUsersByPassengerTravelId should throw an exception for an invalid passengerTravel', async () => {
    await expect(() =>
      service.findUsersByPassengerTravelId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('associateUsersPassengerTravel should update users list for a passengerTravel', async () => {
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
      verifiedPassengerTravel: false,
      verifiedUser: false,
      isDriver: true,
    });

    const updatedPassengerTravel: PassengerTravelEntity =
      await service.associateUsersPassengerTravel(passengerTravel.id, [
        newUser,
      ]);
    expect(updatedPassengerTravel.passengers.length).toBe(1);
    expect(updatedPassengerTravel.passengers[0].email).toStrictEqual(
      newUser.email,
    );
    expect(updatedPassengerTravel.passengers[0].password).toEqual(
      newUser.password,
    );
    expect(updatedPassengerTravel.passengers[0].name).toEqual(newUser.name);
    expect(updatedPassengerTravel.passengers[0].phone).toEqual(newUser.phone);
    expect(updatedPassengerTravel.passengers[0].genre).toEqual(newUser.genre);
    expect(updatedPassengerTravel.passengers[0].birthDate).toEqual(
      newUser.birthDate,
    );
    expect(updatedPassengerTravel.passengers[0].photo).toEqual(newUser.photo);
    expect(updatedPassengerTravel.passengers[0].idenficiationCard).toEqual(
      newUser.idenficiationCard,
    );
    expect(updatedPassengerTravel.passengers[0].about).toEqual(newUser.about);
    expect(updatedPassengerTravel.passengers[0].score).toEqual(newUser.score);
    expect(updatedPassengerTravel.passengers[0].drivingPass).toEqual(
      newUser.drivingPass,
    );
    expect(updatedPassengerTravel.passengers[0].isDriver).toEqual(
      newUser.isDriver,
    );
    expect(updatedPassengerTravel.passengers[0].state).toEqual(newUser.state);
    expect(updatedPassengerTravel.passengers[0].verifiedMail).toEqual(
      newUser.verifiedMail,
    );
    expect(updatedPassengerTravel.passengers[0].verifiedPhone).toEqual(
      newUser.verifiedPhone,
    );
    expect(updatedPassengerTravel.passengers[0].verifiedIC).toEqual(
      newUser.verifiedIC,
    );
    expect(updatedPassengerTravel.passengers[0].verifiedDrivingPass).toEqual(
      newUser.verifiedDrivingPass,
    );
    expect(updatedPassengerTravel.passengers[0].verifiedUser).toEqual(
      newUser.verifiedUser,
    );
  });

  it('associateUsersPassengerTravel should throw an exception for an invalid passengerTravel', async () => {
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
      verifiedPassengerTravel: false,
      verifiedUser: false,
      isDriver: true,
    });

    await expect(() =>
      service.associateUsersPassengerTravel('0', [newUser]),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('associateUsersPassengerTravel should throw an exception for an invalid user', async () => {
    const newUser: UserEntity = usersList[0];
    newUser.id = '0';

    await expect(() =>
      service.associateUsersPassengerTravel(passengerTravel.id, [newUser]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteUserToPassengerTravel should remove an user from a passengerTravel', async () => {
    const user: UserEntity = usersList[0];

    await service.deleteUserPassengerTravel(passengerTravel.id, user.id);

    const storedPassengerTravel: PassengerTravelEntity =
      await passengerTravelRepository.findOne({
        where: { id: passengerTravel.id },
        relations: ['passengers'],
      });
    const deletedUser: UserEntity = storedPassengerTravel.passengers.find(
      (a) => a.id === user.id,
    );

    expect(deletedUser).toBeUndefined();
  });

  it('deleteUserToPassengerTravel should thrown an exception for an invalid user', async () => {
    await expect(() =>
      service.deleteUserPassengerTravel(passengerTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteUserToPassengerTravel should thrown an exception for an invalid passengerTravel', async () => {
    const user: UserEntity = usersList[0];
    await expect(() =>
      service.deleteUserPassengerTravel('0', user.id),
    ).rejects.toHaveProperty(
      'message',
      'The passengerTravel with the given id was not found',
    );
  });

  it('deleteUserToPassengerTravel should thrown an exception for an non asocciated user', async () => {
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
      verifiedPassengerTravel: false,
      verifiedUser: false,
      isDriver: true,
    });

    await expect(() =>
      service.deleteUserPassengerTravel(passengerTravel.id, newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id is not associated to the passengerTravel',
    );
  });
});
