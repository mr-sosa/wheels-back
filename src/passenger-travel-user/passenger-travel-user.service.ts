import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class PassengerTravelUserService {
  constructor(
    @InjectRepository(PassengerTravelEntity)
    private readonly passengerTravelRepository: Repository<PassengerTravelEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async addUserPassengerTravel(
    passengerTravelId: string,
    userId: string,
  ): Promise<PassengerTravelEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
        relations: ['passengers'],
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    passengerTravel.passengers = [...passengerTravel.passengers, user];
    return await this.passengerTravelRepository.save(passengerTravel);
  }

  async findUserByPassengerTravelIdUserId(
    passengerTravelId: string,
    userId: string,
  ): Promise<UserEntity> {
    return await this.validate(passengerTravelId, userId);
  }

  async findUsersByPassengerTravelId(
    passengerId: string,
  ): Promise<UserEntity[]> {
    const passenger: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerId },
        relations: ['passengers'],
      });
    if (!passenger)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return passenger.passengers;
  }

  async associateUsersPassengerTravel(
    passengerTravelId: string,
    users: UserEntity[],
  ): Promise<PassengerTravelEntity> {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
        relations: ['passengers'],
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
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

    passengerTravel.passengers = users;
    return await this.passengerTravelRepository.save(passengerTravel);
  }

  async deleteUserPassengerTravel(passengerTravelId: string, userId: string) {
    await this.validate(passengerTravelId, userId);

    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
        relations: ['passengers'],
      });

    passengerTravel.passengers = passengerTravel.passengers.filter(
      (e) => e.id !== userId,
    );
    await this.passengerTravelRepository.save(passengerTravel);
  }

  async validate(passengerTravelId: string, userId: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
        relations: ['passengers'],
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const passengerTravelUser: UserEntity = passengerTravel.passengers.find(
      (e) => e.id === user.id,
    );

    if (!passengerTravelUser)
      throw new BusinessLogicException(
        'The user with the given id is not associated to the passengerTravel',
        BusinessError.PRECONDITION_FAILED,
      );

    return passengerTravelUser;
  }
}
