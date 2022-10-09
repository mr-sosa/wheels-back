import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PassengerTravelEntity } from '../passenger-travel/passenger-travel.entity';

@Injectable()
export class UserPassengerTravelService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(PassengerTravelEntity)
    private readonly passengerTravelRepository: Repository<PassengerTravelEntity>,
  ) {}

  async addPassengerTravelUser(
    userId: string,
    passengerTravelId: string,
  ): Promise<UserEntity> {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['passengerTravels'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    user.passengerTravels = [...user.passengerTravels, passengerTravel];
    return await this.userRepository.save(user);
  }

  async findPassengerTravelByUserIdPassengerTravelId(
    userId: string,
    passengerTravelId: string,
  ): Promise<PassengerTravelEntity> {
    return await this.validate(userId, passengerTravelId);
  }

  async findPassengerTravelsByUserId(
    userId: string,
  ): Promise<PassengerTravelEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['passengerTravels'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.passengerTravels;
  }

  async associatePassengerTravelsUser(
    userId: string,
    passengerTravels: PassengerTravelEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['passengerTravels'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < passengerTravels.length; i++) {
      const passengerTravel: PassengerTravelEntity =
        await this.passengerTravelRepository.findOne({
          where: { id: passengerTravels[i].id },
        });
      if (!passengerTravel)
        throw new BusinessLogicException(
          'The passengerTravel with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.passengerTravels = passengerTravels;
    return await this.userRepository.save(user);
  }

  async deletePassengerTravelUser(userId: string, passengerTravelId: string) {
    await this.validate(userId, passengerTravelId);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['passengerTravels'],
    });

    user.passengerTravels = user.passengerTravels.filter(
      (e) => e.id !== passengerTravelId,
    );
    await this.userRepository.save(user);
  }

  async validate(userId: string, passengerTravelId: string) {
    const passengerTravel: PassengerTravelEntity =
      await this.passengerTravelRepository.findOne({
        where: { id: passengerTravelId },
      });
    if (!passengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['passengerTravels'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userPassengerTravel: PassengerTravelEntity =
      user.passengerTravels.find((e) => e.id === passengerTravel.id);

    if (!userPassengerTravel)
      throw new BusinessLogicException(
        'The passengerTravel with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userPassengerTravel;
  }
}
