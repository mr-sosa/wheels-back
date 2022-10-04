import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PassengerTravelEntity } from './passenger-travel.entity';

const state = ['OPEN', 'ACCEPTED', 'INPROGRESS', 'FINISHED', 'CANCELLED'];
@Injectable()
export class PassengerTravelService {
  constructor(
    @InjectRepository(PassengerTravelEntity)
    private readonly passengerTravelRepository: Repository<PassengerTravelEntity>,
  ) {}

  async findAll(): Promise<PassengerTravelEntity[]> {
    return await this.passengerTravelRepository.find({
      relations: ['passengers', 'origin', 'destination', 'driverTravel'],
    });
  }

  async findOne(id: string): Promise<PassengerTravelEntity> {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id },
        relations: ['passengers', 'origin', 'destination', 'driverTravel'],
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return passengerTravel;
  }

  async create(
    passengerTravel: PassengerTravelEntity,
  ): Promise<PassengerTravelEntity> {
    await this.verifyEnumerations(passengerTravel);
    return await this.passengerTravelRepository.save(passengerTravel);
  }

  async update(
    id: string,
    passengerTravel: PassengerTravelEntity,
  ): Promise<PassengerTravelEntity> {
    const persistedPassengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id },
        relations: ['passengers', 'origin', 'destination', 'driverTravel'],
      });
    if (!persistedPassengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.verifyEnumerations(passengerTravel);
    return await this.passengerTravelRepository.save({
      ...persistedPassengerTravel,
      ...passengerTravel,
    });
  }

  async delete(id: string) {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id },
        relations: ['passengers', 'origin', 'destination', 'driverTravel'],
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.passengerTravelRepository.remove(passengerTravel);
  }

  private async verifyEnumerations(passengerTravel: PassengerTravelEntity) {
    if (!state.includes(passengerTravel.state)) {
      throw new BusinessLogicException(
        'Invalid state of passengerTravel',
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
