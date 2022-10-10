import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';

@Injectable()
export class UserDriverTravelByDriverService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelByDriverRepository: Repository<DriverTravelEntity>,
  ) {}

  async addDriverTravelByDriverUser(
    userId: string,
    driverTravelByDriverId: string,
  ): Promise<UserEntity> {
    const driverTravelByDriver: DriverTravelEntity =
      await this.driverTravelByDriverRepository.findOne({
        where: { id: driverTravelByDriverId },
      });
    if (!driverTravelByDriver)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driverTravelsByDriver'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (!user.isDriver)
      throw new BusinessLogicException(
        'The user is not a driver',
        BusinessError.PRECONDITION_FAILED,
      );

    user.driverTravelsByDriver = [
      ...user.driverTravelsByDriver,
      driverTravelByDriver,
    ];
    return await this.userRepository.save(user);
  }

  async findDriverTravelByDriverByUserIdDriverTravelByDriverId(
    userId: string,
    driverTravelByDriverId: string,
  ): Promise<DriverTravelEntity> {
    return await this.validate(userId, driverTravelByDriverId);
  }

  async findDriverTravelByDriversByUserId(
    userId: string,
  ): Promise<DriverTravelEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driverTravelsByDriver'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.driverTravelsByDriver;
  }

  async associateDriverTravelByDriversUser(
    userId: string,
    driverTravelsByDriver: DriverTravelEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driverTravelsByDriver'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (!user.isDriver)
      throw new BusinessLogicException(
        'The user is not a driver',
        BusinessError.PRECONDITION_FAILED,
      );

    for (let i = 0; i < driverTravelsByDriver.length; i++) {
      const driverTravelByDriver: DriverTravelEntity =
        await this.driverTravelByDriverRepository.findOne({
          where: { id: driverTravelsByDriver[i].id },
        });
      if (!driverTravelByDriver)
        throw new BusinessLogicException(
          'The driverTravel with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.driverTravelsByDriver = driverTravelsByDriver;
    return await this.userRepository.save(user);
  }

  async deleteDriverTravelByDriverUser(
    userId: string,
    driverTravelByDriverId: string,
  ) {
    await this.validate(userId, driverTravelByDriverId);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driverTravelsByDriver'],
    });

    user.driverTravelsByDriver = user.driverTravelsByDriver.filter(
      (e) => e.id !== driverTravelByDriverId,
    );
    await this.userRepository.save(user);
  }

  async validate(userId: string, driverTravelByDriverId: string) {
    const driverTravelByDriver: DriverTravelEntity =
      await this.driverTravelByDriverRepository.findOne({
        where: { id: driverTravelByDriverId },
      });
    if (!driverTravelByDriver)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driverTravelsByDriver'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userDriverTravelByDriver: DriverTravelEntity =
      user.driverTravelsByDriver.find((e) => e.id === driverTravelByDriver.id);

    if (!userDriverTravelByDriver)
      throw new BusinessLogicException(
        'The driverTravel with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userDriverTravelByDriver;
  }
}
