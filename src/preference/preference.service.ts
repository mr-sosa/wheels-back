import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PreferenceEntity } from './preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(PreferenceEntity)
    private readonly preferenceRepository: Repository<PreferenceEntity>,
  ) {}

  async findAll(): Promise<PreferenceEntity[]> {
    return await this.preferenceRepository.find({
      relations: ['users', 'driverTravels'],
    });
  }

  async findOne(id: string): Promise<PreferenceEntity> {
    const preference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id },
        relations: ['users', 'driverTravels'],
      });
    if (!preference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return preference;
  }

  async create(preference: PreferenceEntity): Promise<PreferenceEntity> {
    return await this.preferenceRepository.save(preference);
  }

  async update(
    id: string,
    preference: PreferenceEntity,
  ): Promise<PreferenceEntity> {
    const persistedPreference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id },
        relations: ['users', 'driverTravels'],
      });
    if (!persistedPreference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.preferenceRepository.save({
      ...persistedPreference,
      ...preference,
    });
  }

  async delete(id: string) {
    const preference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id },
        relations: ['users', 'driverTravels'],
      });
    if (!preference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.preferenceRepository.remove(preference);
  }
}
