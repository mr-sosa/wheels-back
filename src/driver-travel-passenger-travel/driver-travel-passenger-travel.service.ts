import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';

@Injectable()
export class DriverTravelPassengerTravelService {
  constructor(
    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelRepository: Repository<DriverTravelEntity>,

    @InjectRepository(PassengerTravelEntity)
    private readonly passengerTravelRepository: Repository<PassengerTravelEntity>,
  ) {}

  async addPassengerTravelDriverTravel(
    driverTravelId: string,
    passengerTravelId: string,
  ): Promise<DriverTravelEntity> {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengerTravels'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    driverTravel.passengerTravels = [
      ...driverTravel.passengerTravels,
      passengerTravel,
    ];
    return await this.driverTravelRepository.save(driverTravel);
  }

  async findPassengerTravelByDriverTravelIdPassengerTravelId(
    driverTravelId: string,
    passengerTravelId: string,
  ): Promise<PassengerTravelEntity> {
    return await this.validate(driverTravelId, passengerTravelId);
  }

  async findPassengerTravelsByDriverTravelId(
    driverTravelId: string,
  ): Promise<PassengerTravelEntity[]> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengerTravels'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return driverTravel.passengerTravels;
  }

  async associatePassengerTravelsDriverTravel(
    driverTravelId: string,
    passengerTravels: PassengerTravelEntity[],
  ): Promise<DriverTravelEntity> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengerTravels'],
      });

    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < passengerTravels.length; i++) {
      const passengerTravel: PassengerTravelEntity =
        await this.passengerTravelRepository.findOne({
          where: { id: passengerTravels[i].id },
        });
      if (!passengerTravel)
        throw new BusinessLogicException(
          'The passengerTravel with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    driverTravel.passengerTravels = passengerTravels;
    return await this.driverTravelRepository.save(driverTravel);
  }

  async deletePassengerTravelDriverTravel(
    driverTravelId: string,
    passengerTravelId: string,
  ) {
    await this.validate(driverTravelId, passengerTravelId);

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengerTravels'],
      });

    driverTravel.passengerTravels = driverTravel.passengerTravels.filter(
      (e) => e.id !== passengerTravelId,
    );
    await this.driverTravelRepository.save(driverTravel);
  }

  async validate(driverTravelId: string, passengerTravelId: string) {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengerTravels'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravelPassengerTravel: PassengerTravelEntity =
      driverTravel.passengerTravels.find((e) => e.id === passengerTravel.id);

    if (!driverTravelPassengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id is not associated to the driverTravel',
        BusinessError.PRECONDITION_FAILED,
      );

    return driverTravelPassengerTravel;
  }
}
