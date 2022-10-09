import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PreferenceEntity } from '../preference/preference.entity';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(PreferenceEntity)
    private readonly preferenceRepository: Repository<PreferenceEntity>,
  ) {}

  async addPreferenceUser(
    userId: string,
    preferenceId: string,
  ): Promise<UserEntity> {
    const preference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id: preferenceId },
      });
    if (!preference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    user.preferences = [...user.preferences, preference];
    return await this.userRepository.save(user);
  }

  async findPreferenceByUserIdPreferenceId(
    userId: string,
    preferenceId: string,
  ): Promise<PreferenceEntity> {
    return await this.validate(userId, preferenceId);
  }

  async findPreferencesByUserId(userId: string): Promise<PreferenceEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.preferences;
  }

  async associatePreferencesUser(
    userId: string,
    preferences: PreferenceEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < preferences.length; i++) {
      const preference: PreferenceEntity =
        await this.preferenceRepository.findOne({
          where: { id: preferences[i].id },
        });
      if (!preference)
        throw new BusinessLogicException(
          'The preference with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.preferences = preferences;
    return await this.userRepository.save(user);
  }

  async deletePreferenceUser(userId: string, preferenceId: string) {
    await this.validate(userId, preferenceId);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });

    user.preferences = user.preferences.filter((e) => e.id !== preferenceId);
    await this.userRepository.save(user);
  }

  async validate(userId: string, preferenceId: string) {
    const preference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id: preferenceId },
      });
    if (!preference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userPreference: PreferenceEntity = user.preferences.find(
      (e) => e.id === preference.id,
    );

    if (!userPreference)
      throw new BusinessLogicException(
        'The preference with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userPreference;
  }
}
