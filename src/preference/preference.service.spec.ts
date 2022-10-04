import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PreferenceEntity } from './preference.entity';
import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let service: PreferenceService;
  let repository: Repository<PreferenceEntity>;
  let preferencesList: PreferenceEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PreferenceService],
    }).compile();

    service = module.get<PreferenceService>(PreferenceService);
    repository = module.get<Repository<PreferenceEntity>>(
      getRepositoryToken(PreferenceEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    preferencesList = [];
    for (let i = 0; i < 5; i++) {
      const preference: PreferenceEntity = await repository.save({
        type: 'LIKEMUSIC',
      });
      preferencesList.push(preference);
    }
  };

  it('findAll should return all preferences', async () => {
    const preferences: PreferenceEntity[] = await service.findAll();
    expect(preferences).not.toBeNull();
    expect(preferences).toHaveLength(preferencesList.length);
  });

  it('findOne should return a preference by id', async () => {
    const storedPreference: PreferenceEntity = preferencesList[0];
    const preference: PreferenceEntity = await service.findOne(
      storedPreference.id,
    );
    expect(preference).not.toBeNull();
    expect(preference.type).toEqual(storedPreference.type);
  });

  it('findOne should throw an exception for an invalid preference', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('create should return a new preference', async () => {
    const preference: PreferenceEntity = {
      id: '',
      type: 'LIKEMUSIC',
      users: null,
      driverTravels: null,
    };

    const newPreference: PreferenceEntity = await service.create(preference);
    expect(newPreference).not.toBeNull();

    const storedPreference: PreferenceEntity = await repository.findOne({
      where: { id: newPreference.id },
    });
    expect(preference).not.toBeNull();
    expect(preference.type).toEqual(storedPreference.type);
  });

  it('create should throw an exception for an invalid type of preference', async () => {
    const preference: PreferenceEntity = {
      id: '',
      type: faker.datatype.string(5),
      users: null,
      driverTravels: null,
    };

    await expect(() => service.create(preference)).rejects.toHaveProperty(
      'message',
      'Invalid type of preference',
    );
  });

  it('update should modify a preference', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    preference.type = 'LIKEMUSIC';
    const updatedPreference: PreferenceEntity = await service.update(
      preference.id,
      preference,
    );
    expect(updatedPreference).not.toBeNull();
    const storedPreference: PreferenceEntity = await repository.findOne({
      where: { id: preference.id },
    });
    expect(storedPreference).not.toBeNull();
    expect(storedPreference.type).toEqual(preference.type);
  });

  it('update should throw an exception for an invalid preference', async () => {
    let preference: PreferenceEntity = preferencesList[0];
    preference = {
      ...preference,
      type: 'LIKEMUSIC',
    };
    await expect(() => service.update('0', preference)).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid type of preference', async () => {
    let preference: PreferenceEntity = preferencesList[0];
    preference = {
      ...preference,
      type: faker.datatype.string(),
    };
    await expect(() =>
      service.update(preference.id, preference),
    ).rejects.toHaveProperty('message', 'Invalid type of preference');
  });

  it('delete should remove a preference', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    await service.delete(preference.id);
    const deletedPreference: PreferenceEntity = await repository.findOne({
      where: { id: preference.id },
    });
    expect(deletedPreference).toBeNull();
  });

  it('delete should throw an exception for an invalid preference', async () => {
    const preference: PreferenceEntity = preferencesList[0];
    await service.delete(preference.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The preference with the given id was not found',
    );
  });
});
