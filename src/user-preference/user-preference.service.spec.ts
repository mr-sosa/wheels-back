import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserPreferenceService } from './user-preference.service';
import { UserEntity } from '../user/user.entity';
import { PreferenceEntity } from '../preference/preference.entity';

describe('UserPreferenceService', () => {
  let service: UserPreferenceService;
  let userRepository: Repository<UserEntity>;
  let preferenceRepository: Repository<PreferenceEntity>;
  let user: UserEntity;
  let preferencesList: PreferenceEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserPreferenceService],
    }).compile();

    service = module.get<UserPreferenceService>(UserPreferenceService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    preferenceRepository = module.get<Repository<PreferenceEntity>>(
      getRepositoryToken(PreferenceEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    preferenceRepository.clear();
    userRepository.clear();

    preferencesList = [];
    for (let i = 0; i < 5; i++) {
      const preference: PreferenceEntity = await preferenceRepository.save({
        type: 'LIKEMUSIC',
      });
      preferencesList.push(preference);
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
      preferences: preferencesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPreferenceUser should add an preference to a user', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
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

    const result: UserEntity = await service.addPreferenceUser(
      newUser.id,
      newPreference.id,
    );

    expect(result.preferences.length).toBe(1);
    expect(result.preferences[0]).not.toBeNull();
    expect(result.preferences[0].type).toStrictEqual(newPreference.type);
  });

  it('addPreferenceUser should thrown exception for an invalid preference', async () => {
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
      service.addPreferenceUser(newUser.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('addPreferenceUser should throw an exception for an invalid user', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.addPreferenceUser('0', newPreference.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findPreferenceByUserIdPreferenceId should return preference by user', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    const storedPreference: PreferenceEntity =
      await service.findPreferenceByUserIdPreferenceId(user.id, preference.id);

    expect(storedPreference).not.toBeNull();
    expect(storedPreference.type).toStrictEqual(preference.type);
  });

  it('findPreferenceByUserIdPreferenceId should throw an exception for an invalid preference', async () => {
    await expect(() =>
      service.findPreferenceByUserIdPreferenceId(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('findPreferenceByUserIdPreferenceId should throw an exception for an invalid user', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    await expect(() =>
      service.findPreferenceByUserIdPreferenceId('0', preference.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findPreferenceByUserIdPreferenceId should throw an exception for an preference not associated to the user', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.findPreferenceByUserIdPreferenceId(user.id, newPreference.id),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id is not associated to the user',
    );
  });

  it('findPreferencesByUserId should return preferences by user', async () => {
    const preferences: PreferenceEntity[] =
      await service.findPreferencesByUserId(user.id);
    expect(preferences.length).toBe(5);
  });

  it('findPreferencesByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findPreferencesByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associatePreferencesUser should update preferences list for a user', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    const updatedUser: UserEntity = await service.associatePreferencesUser(
      user.id,
      [newPreference],
    );
    expect(updatedUser.preferences.length).toBe(1);
    expect(updatedUser.preferences[0].type).toStrictEqual(newPreference.type);
  });

  it('associatePreferencesUser should throw an exception for an invalid user', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.associatePreferencesUser('0', [newPreference]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associatePreferencesUser should throw an exception for an invalid preference', async () => {
    const newPreference: PreferenceEntity = preferencesList[0];
    newPreference.id = '0';

    await expect(() =>
      service.associatePreferencesUser(user.id, [newPreference]),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('deletePreferenceToUser should remove an preference from a user', async () => {
    const preference: PreferenceEntity = preferencesList[0];

    await service.deletePreferenceUser(user.id, preference.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['preferences'],
    });
    const deletedPreference: PreferenceEntity = storedUser.preferences.find(
      (a) => a.id === preference.id,
    );

    expect(deletedPreference).toBeUndefined();
  });

  it('deletePreferenceToUser should thrown an exception for an invalid preference', async () => {
    await expect(() =>
      service.deletePreferenceUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('deletePreferenceToUser should thrown an exception for an invalid user', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    await expect(() =>
      service.deletePreferenceUser('0', preference.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deletePreferenceToUser should thrown an exception for an non asocciated preference', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.deletePreferenceUser(user.id, newPreference.id),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id is not associated to the user',
    );
  });
});
