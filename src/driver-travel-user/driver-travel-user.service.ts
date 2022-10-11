import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class DriverTravelUserService {
  constructor(
    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelRepository: Repository<DriverTravelEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async addUserDriverTravel(
    driverTravelId: string,
    userId: string,
  ): Promise<DriverTravelEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengers'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    driverTravel.passengers = [...driverTravel.passengers, user];
    return await this.driverTravelRepository.save(driverTravel);
  }

  async findUserByDriverTravelIdUserId(
    driverTravelId: string,
    userId: string,
  ): Promise<UserEntity> {
    return await this.validate(driverTravelId, userId);
  }

  async findUsersByDriverTravelId(
    driverTravelId: string,
  ): Promise<UserEntity[]> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengers'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return driverTravel.passengers;
  }

  async associateUsersDriverTravel(
    driverTravelId: string,
    users: UserEntity[],
  ): Promise<DriverTravelEntity> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengers'],
      });

    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < users.length; i++) {
      const user: UserEntity = await this.userRepository.findOne({
        where: { id: users[i].id },
      });
      if (!user)
        throw new BusinessLogicException(
          'The user with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    driverTravel.passengers = users;
    return await this.driverTravelRepository.save(driverTravel);
  }

  async deleteUserDriverTravel(driverTravelId: string, userId: string) {
    await this.validate(driverTravelId, userId);

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengers'],
      });

    driverTravel.passengers = driverTravel.passengers.filter(
      (e) => e.id !== userId,
    );
    await this.driverTravelRepository.save(driverTravel);
  }

  async validate(driverTravelId: string, userId: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['passengers'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravelUser: UserEntity = driverTravel.passengers.find(
      (e) => e.id === user.id,
    );

    if (!driverTravelUser)
      throw new BusinessLogicException(
        'The user with the given id is not associated to the driverTravel',
        BusinessError.PRECONDITION_FAILED,
      );

    return driverTravelUser;
  }
}
