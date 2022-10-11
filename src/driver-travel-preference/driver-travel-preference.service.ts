import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PreferenceEntity } from '../preference/preference.entity';

@Injectable()
export class DriverTravelPreferenceService {
  constructor(
    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelRepository: Repository<DriverTravelEntity>,

    @InjectRepository(PreferenceEntity)
    private readonly preferenceRepository: Repository<PreferenceEntity>,
  ) {}

  async addPreferenceDriverTravel(
    driverTravelId: string,
    preferenceId: string,
  ): Promise<DriverTravelEntity> {
    const preference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id: preferenceId },
      });
    if (!preference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['preferences'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    driverTravel.preferences = [...driverTravel.preferences, preference];
    return await this.driverTravelRepository.save(driverTravel);
  }

  async findPreferenceByDriverTravelIdPreferenceId(
    driverTravelId: string,
    preferenceId: string,
  ): Promise<PreferenceEntity> {
    return await this.validate(driverTravelId, preferenceId);
  }

  async findPreferencesByDriverTravelId(
    driverTravelId: string,
  ): Promise<PreferenceEntity[]> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['preferences'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return driverTravel.preferences;
  }

  async associatePreferencesDriverTravel(
    driverTravelId: string,
    preferences: PreferenceEntity[],
  ): Promise<DriverTravelEntity> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['preferences'],
      });

    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
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

    driverTravel.preferences = preferences;
    return await this.driverTravelRepository.save(driverTravel);
  }

  async deletePreferenceDriverTravel(
    driverTravelId: string,
    preferenceId: string,
  ) {
    await this.validate(driverTravelId, preferenceId);

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['preferences'],
      });

    driverTravel.preferences = driverTravel.preferences.filter(
      (e) => e.id !== preferenceId,
    );
    await this.driverTravelRepository.save(driverTravel);
  }

  async validate(driverTravelId: string, preferenceId: string) {
    const preference: PreferenceEntity =
      await this.preferenceRepository.findOne({
        where: { id: preferenceId },
      });
    if (!preference)
      throw new BusinessLogicException(
        'The preference with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['preferences'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravelPreference: PreferenceEntity =
      driverTravel.preferences.find((e) => e.id === preference.id);

    if (!driverTravelPreference)
      throw new BusinessLogicException(
        'The preference with the given id is not associated to the driverTravel',
        BusinessError.PRECONDITION_FAILED,
      );

    return driverTravelPreference;
  }
}
