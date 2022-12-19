import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { UserEntity } from './user.entity';

const state = ['ACTIVE', 'INACTIVE'];
const genre = ['MALE', 'FEMALE', 'OTHER', ''];
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    page: number,
    email: string,
    isDriver: boolean,
  ): Promise<UserEntity[]> {
    return await this.userRepository.find({
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
      where: { email: email, isDriver: isDriver },
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
    user.state = 'ACTIVE';
    user.isDriver = false;
    user.verifiedIC = false;
    user.verifiedUser = false;
    user.verifiedDrivingPass = false;
    await this.verifyEnumerations(user);
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
    await this.verifyEnumerations(user);
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

  private async verifyEnumerations(user: UserEntity) {
    if (!state.includes(user.state)) {
      throw new BusinessLogicException(
        'Invalid state of user',
        BusinessError.BAD_REQUEST,
      );
    }
    if (!genre.includes(user.genre)) {
      throw new BusinessLogicException(
        'Invalid genre of user',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async updateUserImageById(id: string, imagePath: string) {
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

    persistedUser.photo = imagePath;
    return from(this.userRepository.save(persistedUser));
  }

  findImageNameByUserId(id: string): Observable<string> {
    return from(this.findOne(id)).pipe(map((user: UserEntity) => user.photo));
  }
}
