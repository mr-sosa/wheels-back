import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';

@Injectable()
export class UserVehicleService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async addVehicleUser(userId: string, vehicleId: string): Promise<UserEntity> {
    const vehicle: VehicleEntity = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle)
      throw new BusinessLogicException(
        'The vehicle with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vehicles'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (!user.isDriver) {
      throw new BusinessLogicException(
        'The user is not a driver',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    user.vehicles = [...user.vehicles, vehicle];
    return await this.userRepository.save(user);
  }

  async findVehicleByUserIdVehicleId(
    userId: string,
    vehicleId: string,
  ): Promise<VehicleEntity> {
    return await this.validate(userId, vehicleId);
  }

  async findVehiclesByUserId(userId: string): Promise<VehicleEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vehicles'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.vehicles;
  }

  async associateVehiclesUser(
    userId: string,
    vehicles: VehicleEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vehicles'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!user.isDriver) {
      throw new BusinessLogicException(
        'The user is not a driver',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle: VehicleEntity = await this.vehicleRepository.findOne({
        where: { id: vehicles[i].id },
      });
      if (!vehicle)
        throw new BusinessLogicException(
          'The vehicle with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.vehicles = vehicles;
    return await this.userRepository.save(user);
  }

  async deleteVehicleUser(userId: string, vehicleId: string) {
    await this.validate(userId, vehicleId);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vehicles'],
    });

    user.vehicles = user.vehicles.filter((e) => e.id !== vehicleId);
    await this.userRepository.save(user);
  }

  async validate(userId: string, vehicleId: string) {
    const vehicle: VehicleEntity = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle)
      throw new BusinessLogicException(
        'The vehicle with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vehicles'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userVehicle: VehicleEntity = user.vehicles.find(
      (e) => e.id === vehicle.id,
    );

    if (!userVehicle)
      throw new BusinessLogicException(
        'The vehicle with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userVehicle;
  }
}
