import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(): Promise<AddressEntity[]> {
    return await this.addressRepository.find({
      relations: [
        'users',
        'originPassengerTravels',
        'destinationPassengerTravels',
        'originDriverTravels',
        'destinationDriverTravels',
        'point',
      ],
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
    await this.verifyEnumerations(address);
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

    await this.verifyEnumerations(address);
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

  private async verifyEnumerations(address: AddressEntity) {
    if (!MainRoad.includes(address.mainRoad)) {
      throw new BusinessLogicException(
        'Invalid mainRoad of address',
        BusinessError.BAD_REQUEST,
      );
    }
    if (!Quadrant.includes(address.fisrtQuadrant)) {
      throw new BusinessLogicException(
        'Invalid fisrtQuadrant of address',
        BusinessError.BAD_REQUEST,
      );
    }
    if (!Quadrant.includes(address.secondQuadrant)) {
      throw new BusinessLogicException(
        'Invalid secondQuadrant of address',
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
