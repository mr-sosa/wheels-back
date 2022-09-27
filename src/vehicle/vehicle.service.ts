import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async findAll(): Promise<VehicleEntity[]> {
    return await this.vehicleRepository.find({
      relations: ['driverTravels', 'user'],
    });
  }

  async findOne(id: string): Promise<VehicleEntity> {
    const vehicle: VehicleEntity = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['driverTravels', 'user'],
    });
    if (!vehicle)
      throw new BusinessLogicException(
        'The vehicle with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return vehicle;
  }

  async create(vehicle: VehicleEntity): Promise<VehicleEntity> {
    return await this.vehicleRepository.save(vehicle);
  }

  async update(id: string, vehicle: VehicleEntity): Promise<VehicleEntity> {
    const persistedVehicle: VehicleEntity =
      await this.vehicleRepository.findOne({
        where: { id },
        relations: ['driverTravels', 'user'],
      });
    if (!persistedVehicle)
      throw new BusinessLogicException(
        'The vehicle with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.vehicleRepository.save({
      ...persistedVehicle,
      ...vehicle,
    });
  }

  async delete(id: string) {
    const vehicle: VehicleEntity = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['driverTravels', 'user'],
    });
    if (!vehicle)
      throw new BusinessLogicException(
        'The vehicle with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.vehicleRepository.remove(vehicle);
  }
}
