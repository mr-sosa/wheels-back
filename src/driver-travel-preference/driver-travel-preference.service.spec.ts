import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DriverTravelPreferenceService } from './driver-travel-preference.service';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PreferenceEntity } from '../preference/preference.entity';

describe('DriverTravelPreferenceService', () => {
  let service: DriverTravelPreferenceService;
  let driverTravelRepository: Repository<DriverTravelEntity>;
  let preferenceRepository: Repository<PreferenceEntity>;
  let driverTravel: DriverTravelEntity;
  let preferencesList: PreferenceEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DriverTravelPreferenceService],
    }).compile();

    service = module.get<DriverTravelPreferenceService>(
      DriverTravelPreferenceService,
    );
    driverTravelRepository = module.get<Repository<DriverTravelEntity>>(
      getRepositoryToken(DriverTravelEntity),
    );
    preferenceRepository = module.get<Repository<PreferenceEntity>>(
      getRepositoryToken(PreferenceEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    preferenceRepository.clear();
    driverTravelRepository.clear();

    preferencesList = [];
    for (let i = 0; i < 5; i++) {
      const preference: PreferenceEntity = await preferenceRepository.save({
        type: 'LIKEMUSIC',
      });
      preferencesList.push(preference);
    }

    driverTravel = await driverTravelRepository.save({
      date: faker.date.soon(),
      spaceAvailable: faker.datatype.number(6),
      state: 'OPEN',
      preferences: preferencesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPreferenceDriverTravel should add an preference to a driverTravel', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    const result: DriverTravelEntity = await service.addPreferenceDriverTravel(
      newDriverTravel.id,
      newPreference.id,
    );

    expect(result.preferences.length).toBe(1);
    expect(result.preferences[0]).not.toBeNull();
    expect(result.preferences[0].type).toStrictEqual(newPreference.type);
  });

  it('addPreferenceDriverTravel should thrown exception for an invalid preference', async () => {
    const newDriverTravel: DriverTravelEntity =
      await driverTravelRepository.save({
        date: faker.date.soon(),
        spaceAvailable: faker.datatype.number(6),
        state: 'OPEN',
      });

    await expect(() =>
      service.addPreferenceDriverTravel(newDriverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('addPreferenceDriverTravel should throw an exception for an invalid driverTravel', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.addPreferenceDriverTravel('0', newPreference.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findPreferenceByDriverTravelIdPreferenceId should return preference by driverTravel', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    const storedPreference: PreferenceEntity =
      await service.findPreferenceByDriverTravelIdPreferenceId(
        driverTravel.id,
        preference.id,
      );

    expect(storedPreference).not.toBeNull();
    expect(storedPreference.type).toStrictEqual(preference.type);
  });

  it('findPreferenceByDriverTravelIdPreferenceId should throw an exception for an invalid preference', async () => {
    await expect(() =>
      service.findPreferenceByDriverTravelIdPreferenceId(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('findPreferenceByDriverTravelIdPreferenceId should throw an exception for an invalid driverTravel', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    await expect(() =>
      service.findPreferenceByDriverTravelIdPreferenceId('0', preference.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('findPreferenceByDriverTravelIdPreferenceId should throw an exception for an preference not associated to the driverTravel', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.findPreferenceByDriverTravelIdPreferenceId(
        driverTravel.id,
        newPreference.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id is not associated to the driverTravel',
    );
  });

  it('findPreferencesByDriverTravelId should return preferences by driverTravel', async () => {
    const preferences: PreferenceEntity[] =
      await service.findPreferencesByDriverTravelId(driverTravel.id);
    expect(preferences.length).toBe(5);
  });

  it('findPreferencesByDriverTravelId should throw an exception for an invalid driverTravel', async () => {
    await expect(() =>
      service.findPreferencesByDriverTravelId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associatePreferencesDriverTravel should update preferences list for a driverTravel', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    const updatedDriverTravel: DriverTravelEntity =
      await service.associatePreferencesDriverTravel(driverTravel.id, [
        newPreference,
      ]);
    expect(updatedDriverTravel.preferences.length).toBe(1);
    expect(updatedDriverTravel.preferences[0].type).toStrictEqual(
      newPreference.type,
    );
  });

  it('associatePreferencesDriverTravel should throw an exception for an invalid driverTravel', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.associatePreferencesDriverTravel('0', [newPreference]),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('associatePreferencesDriverTravel should throw an exception for an invalid preference', async () => {
    const newPreference: PreferenceEntity = preferencesList[0];
    newPreference.id = '0';

    await expect(() =>
      service.associatePreferencesDriverTravel(driverTravel.id, [
        newPreference,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('deletePreferenceToDriverTravel should remove an preference from a driverTravel', async () => {
    const preference: PreferenceEntity = preferencesList[0];

    await service.deletePreferenceDriverTravel(driverTravel.id, preference.id);

    const storedDriverTravel: DriverTravelEntity =
      await driverTravelRepository.findOne({
        where: { id: driverTravel.id },
        relations: ['preferences'],
      });
    const deletedPreference: PreferenceEntity =
      storedDriverTravel.preferences.find((a) => a.id === preference.id);

    expect(deletedPreference).toBeUndefined();
  });

  it('deletePreferenceToDriverTravel should thrown an exception for an invalid preference', async () => {
    await expect(() =>
      service.deletePreferenceDriverTravel(driverTravel.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('deletePreferenceToDriverTravel should thrown an exception for an invalid driverTravel', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    await expect(() =>
      service.deletePreferenceDriverTravel('0', preference.id),
    ).rejects.toHaveProperty(
      'message',
      'The driverTravel with the given id was not found',
    );
  });

  it('deletePreferenceToDriverTravel should thrown an exception for an non asocciated preference', async () => {
    const newPreference: PreferenceEntity = await preferenceRepository.save({
      type: 'LIKEMUSIC',
    });

    await expect(() =>
      service.deletePreferenceDriverTravel(driverTravel.id, newPreference.id),
    ).rejects.toHaveProperty(
      'message',
      'The preference with the given id is not associated to the driverTravel',
    );
  });
});
