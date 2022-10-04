import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.fullName(),
        phone: faker.phone.number(),
        genre: faker.datatype.string(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        photo: faker.image.imageUrl(),
        idenficiationCard: faker.image.imageUrl(),
        about: faker.datatype.string(),
        score: faker.datatype.number({ min: 1, max: 5 }),
        drivingPass: faker.image.imageUrl(),
        isDriver: faker.datatype.boolean(),
        state: faker.datatype.string(),
        verifiedMail: faker.datatype.boolean(),
        verifiedPhone: faker.datatype.boolean(),
        verifiedIC: faker.datatype.boolean(),
        verifiedDrivingPass: faker.datatype.boolean(),
        verifiedUser: false,
      });
      usersList.push(user);
    }
  };

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(usersList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
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

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: '',
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: faker.datatype.string(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      isDriver: faker.datatype.boolean(),
      state: faker.datatype.string(),
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      addresses: null,
      preferences: null,
      passengerTravels: null,
      vehicles: null,
      driverTravelByPassenger: null,
      driverTravelsByDriver: null,
      opinionsMade: null,
      opinionsReceived: null,
    };

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { id: newUser.id },
    });
    expect(user).not.toBeNull();
    expect(user.score).toBeLessThanOrEqual(5);
    expect(user.score).toBeGreaterThanOrEqual(0);
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

  it('update should modify a user', async () => {
    const user: UserEntity = usersList[0];
    email: faker.internet.email(), (user.password = faker.internet.password());
    user.name = faker.name.fullName();
    user.phone = faker.phone.number();
    user.genre = faker.datatype.string();
    user.birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    user.photo = faker.image.imageUrl();
    user.idenficiationCard = faker.image.imageUrl();
    user.about = faker.datatype.string();
    user.score = faker.datatype.number({ min: 1, max: 5 });
    user.drivingPass = faker.image.imageUrl();
    user.isDriver = faker.datatype.boolean();
    user.state = faker.datatype.string();
    user.verifiedMail = faker.datatype.boolean();
    user.verifiedPhone = faker.datatype.boolean();
    user.verifiedIC = faker.datatype.boolean();
    user.verifiedDrivingPass = faker.datatype.boolean();
    user.verifiedUser = false;
    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();
    const storedUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(storedUser).not.toBeNull();
    expect(user.score).toBeLessThanOrEqual(5);
    expect(user.score).toBeGreaterThanOrEqual(0);
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

  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = usersList[0];
    user = {
      ...user,
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: faker.datatype.string(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      isDriver: faker.datatype.boolean(),
      state: faker.datatype.string(),
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
    };
    await expect(() => service.update('0', user)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should remove a user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
    const deletedUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });
});
