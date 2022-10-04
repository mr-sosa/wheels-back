import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private state = ['ACTIVE', 'INACTIVE'];

  private genre = ['MALE', 'FEMALE', 'OTHER'];

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      relations: [
        'addresses',
        'preferences',
        'passengerTravels',
        'vehicles',
        'driverTravelsByDriver',
        'driverTravelByPassenger',
        'opinionsReceived',
        'opinionsMade',
      ],
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: [
        'addresses',
        'preferences',
        'passengerTravels',
        'vehicles',
        'driverTravelsByDriver',
        'driverTravelByPassenger',
        'opinionsReceived',
        'opinionsMade',
      ],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    await this.verifyEnumerationsOfUser(user);
    return await this.userRepository.save(user);
  }

  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const persistedUser: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: [
        'addresses',
        'preferences',
        'passengerTravels',
        'vehicles',
        'driverTravelsByDriver',
        'driverTravelByPassenger',
        'opinionsReceived',
        'opinionsMade',
      ],
    });
    if (!persistedUser)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.verifyEnumerationsOfUser(user);
    return await this.userRepository.save({
      ...persistedUser,
      ...user,
    });
  }

  async delete(id: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: [
        'addresses',
        'preferences',
        'passengerTravels',
        'vehicles',
        'driverTravelsByDriver',
        'driverTravelByPassenger',
        'opinionsReceived',
        'opinionsMade',
      ],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.userRepository.remove(user);
  }

  private async verifyEnumerationsOfUser(user: UserEntity) {
    if (!this.state.includes(user.state)) {
      throw new BusinessLogicException(
        'Invalid state of user',
        BusinessError.BAD_REQUEST,
      );
    }
    if (!this.genre.includes(user.genre)) {
      throw new BusinessLogicException(
        'Invalid genre of user',
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
