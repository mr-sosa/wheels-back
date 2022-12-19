import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  MoreThan,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { DriverTravelEntity } from './driver-travel.entity';

const state = ['OPEN', 'FULL', 'INPROGRESS', 'FINISHED', 'CANCELLED'];
@Injectable()
export class DriverTravelService {
  constructor(
    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelRepository: Repository<DriverTravelEntity>,
  ) {}

  async findAll(
    page: number,
    state: string,
    date: Date,
    quota: number,
    originLat: string,
    originLng: string,
    destinationLat: string,
    destinationLng: string,
  ): Promise<DriverTravelEntity[]> {
    return await this.driverTravelRepository.find({
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
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
      where: {
        state: state,
        date: date === undefined ? null : MoreThanOrEqual(new Date(date)),
        spaceAvailable: quota === undefined ? null : MoreThanOrEqual(quota),
        origin: {
          lat:
            originLat === undefined
              ? null
              : Between(
                  parseFloat(originLat) - 0.01,
                  parseFloat(originLat) + 0.01,
                ),
          lng:
            originLng === undefined
              ? null
              : Between(
                  parseFloat(originLng) - 0.01,
                  parseFloat(originLng) + 0.01,
                ),
        },

        destination: {
          lat:
            destinationLat === undefined
              ? null
              : Between(
                  parseFloat(destinationLat) - 0.01,
                  parseFloat(destinationLat) + 0.01,
                ),
          lng:
            destinationLng === undefined
              ? null
              : Between(
                  parseFloat(destinationLng) - 0.01,
                  parseFloat(destinationLng) + 0.01,
                ),
        },
      },
      order: {
        date: 'ASC',
      },
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
    driverTravel.state = 'OPEN';
    await this.verifyEnumerations(driverTravel);
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

    await this.verifyEnumerations(driverTravel);
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

  private async verifyEnumerations(driverTravel: DriverTravelEntity) {
    if (!state.includes(driverTravel.state)) {
      throw new BusinessLogicException(
        'Invalid state of driverTravel',
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
