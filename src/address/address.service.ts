import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { AddressEntity } from './address.entity';

const MainRoad = [
  'STREET',
  'AVENUE',
  'HIGHWAY',
  'HIGHWAY AVENUE',
  'HIGHWAYSTREET',
  'BOULEVARD',
  'ROAD',
  'PATHWAY',
  'DIAGONAL',
  'KILOMETER',
  'TRANSVERSAL',
  'SIDEWALK',
  'VARIANT',
  'WAY',
  'FREE ZONE',
  'TRUNK',
  'PASSAGEWAY',
];
const Quadrant = [
  'BIS',
  'NORTH',
  'EAST',
  'SOUTH',
  'WEST',
  'NORTHWEST',
  'NORTHEAST',
  'SOUTHWEST',
  'SOUTHEAST',
  '',
];
@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async findAll(latitude: string, longitude: string): Promise<AddressEntity[]> {
    return await this.addressRepository.find({
      relations: [
        'users',
        'originPassengerTravels',
        'destinationPassengerTravels',
        'originDriverTravels',
        'destinationDriverTravels',
        'point',
      ],
      where: {
        lat:
          latitude === undefined
            ? null
            : Between(parseFloat(latitude) - 0.01, parseFloat(latitude) + 0.01),
        lng:
          longitude === undefined
            ? null
            : Between(
                parseFloat(longitude) - 0.01,
                parseFloat(longitude) + 0.01,
              ),
      },
    });
  }

  async findOne(id: string): Promise<AddressEntity> {
    const address: AddressEntity = await this.addressRepository.findOne({
      where: { id },
      relations: [
        'users',
        'originPassengerTravels',
        'destinationPassengerTravels',
        'originDriverTravels',
        'destinationDriverTravels',
        'point',
      ],
    });
    if (!address)
      throw new BusinessLogicException(
        'The address with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return address;
  }

  async create(address: AddressEntity): Promise<AddressEntity> {
    return await this.addressRepository.save(address);
  }

  async update(id: string, address: AddressEntity): Promise<AddressEntity> {
    const persistedAddress: AddressEntity =
      await this.addressRepository.findOne({
        where: { id },
        relations: [
          'users',
          'originPassengerTravels',
          'destinationPassengerTravels',
          'originDriverTravels',
          'destinationDriverTravels',
          'point',
        ],
      });
    if (!persistedAddress)
      throw new BusinessLogicException(
        'The address with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.addressRepository.save({
      ...persistedAddress,
      ...address,
    });
  }

  async delete(id: string) {
    const address: AddressEntity = await this.addressRepository.findOne({
      where: { id },
      relations: [
        'users',
        'originPassengerTravels',
        'destinationPassengerTravels',
        'originDriverTravels',
        'destinationDriverTravels',
        'point',
      ],
    });
    if (!address)
      throw new BusinessLogicException(
        'The address with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.addressRepository.remove(address);
  }
}
