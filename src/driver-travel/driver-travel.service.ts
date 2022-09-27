import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { DriverTravelEntity } from './driver-travel.entity';

@Injectable()
export class DriverTravelService {
  constructor(
    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelRepository: Repository<DriverTravelEntity>,
  ) {}

  async findAll(): Promise<DriverTravelEntity[]> {
    return await this.driverTravelRepository.find({
      relations: [
        'preferences',
        'driver',
        'passengers',
        'vehicle',
        'origin',
        'destination',
        'passengerTravels',
        'routes',
      ],
    });
  }

  async findOne(id: string): Promise<DriverTravelEntity> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id },
        relations: [
          'preferences',
          'driver',
          'passengers',
          'vehicle',
          'origin',
          'destination',
          'passengerTravels',
          'routes',
        ],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return driverTravel;
  }

  async create(driverTravel: DriverTravelEntity): Promise<DriverTravelEntity> {
    return await this.driverTravelRepository.save(driverTravel);
  }

  async update(
    id: string,
    driverTravel: DriverTravelEntity,
  ): Promise<DriverTravelEntity> {
    const persistedDriverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id },
        relations: [
          'preferences',
          'driver',
          'passengers',
          'vehicle',
          'origin',
          'destination',
          'passengerTravels',
          'routes',
        ],
      });
    if (!persistedDriverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.driverTravelRepository.save({
      ...persistedDriverTravel,
      ...driverTravel,
    });
  }

  async delete(id: string) {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id },
        relations: [
          'preferences',
          'driver',
          'passengers',
          'vehicle',
          'origin',
          'destination',
          'passengerTravels',
          'routes',
        ],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.driverTravelRepository.remove(driverTravel);
  }
}