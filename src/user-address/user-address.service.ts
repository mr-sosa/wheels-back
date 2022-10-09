import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AddressEntity } from '../address/address.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async addAddressUser(userId: string, addressId: string): Promise<UserEntity> {
    const address: AddressEntity = await this.addressRepository.findOne({
      where: { id: addressId },
    });
    if (!address)
      throw new BusinessLogicException(
        'The address with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    user.addresses = [...user.addresses, address];
    return await this.userRepository.save(user);
  }

  async findAddressByUserIdAddressId(
    userId: string,
    addressId: string,
  ): Promise<AddressEntity> {
    return await this.validate(userId, addressId);
  }

  async findAddresssByUserId(userId: string): Promise<AddressEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.addresses;
  }

  async associateAddresssUser(
    userId: string,
    addresses: AddressEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < addresses.length; i++) {
      const address: AddressEntity = await this.addressRepository.findOne({
        where: { id: addresses[i].id },
      });
      if (!address)
        throw new BusinessLogicException(
          'The address with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.addresses = addresses;
    return await this.userRepository.save(user);
  }

  async deleteAddressUser(userId: string, addressId: string) {
    await this.validate(userId, addressId);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    user.addresses = user.addresses.filter((e) => e.id !== addressId);
    await this.userRepository.save(user);
  }

  async validate(userId: string, addressId: string) {
    const address: AddressEntity = await this.addressRepository.findOne({
      where: { id: addressId },
    });
    if (!address)
      throw new BusinessLogicException(
        'The address with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userAddress: AddressEntity = user.addresses.find(
      (e) => e.id === address.id,
    );

    if (!userAddress)
      throw new BusinessLogicException(
        'The address with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userAddress;
  }
}
