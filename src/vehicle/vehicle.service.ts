import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable } from 'rxjs';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { VehicleEntity } from './vehicle.entity';

const type = ['CAR', 'ELECTRICCAR', 'MOTORCYCLE'];
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
    await this.verifyEnumerations(vehicle);
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

    await this.verifyEnumerations(vehicle);
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

  private async verifyEnumerations(vehicle: VehicleEntity) {
    if (!type.includes(vehicle.type)) {
      throw new BusinessLogicException(
        'Invalid type of vehicle',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async updateVehicleImageById(id: string, imagePath: string) {
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

    persistedVehicle.photo = imagePath;
    return from(this.vehicleRepository.save(persistedVehicle));
  }

  findImageNameByVehicleId(id: string): Observable<string> {
    return from(this.findOne(id)).pipe(
      map((vehicle: VehicleEntity) => vehicle.photo),
    );
  }
}
