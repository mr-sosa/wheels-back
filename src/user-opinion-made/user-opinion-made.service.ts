import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { OpinionEntity } from '../opinion/opinion.entity';

@Injectable()
export class UserOpinionMadeService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(OpinionEntity)
    private readonly opinionRepository: Repository<OpinionEntity>,
  ) {}

  async addOpinionUser(userId: string, opinionId: string): Promise<UserEntity> {
    const opinion: OpinionEntity = await this.opinionRepository.findOne({
      where: { id: opinionId },
    });
    if (!opinion)
      throw new BusinessLogicException(
        'The opinionMade with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsMade'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    user.opinionsMade = [...user.opinionsMade, opinion];
    return await this.userRepository.save(user);
  }

  async findOpinionByUserIdOpinionId(
    userId: string,
    opinionId: string,
  ): Promise<OpinionEntity> {
    const opinion: OpinionEntity = await this.opinionRepository.findOne({
      where: { id: opinionId },
    });
    if (!opinion)
      throw new BusinessLogicException(
        'The opinionMade with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsMade'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userOpinion: OpinionEntity = user.opinionsMade.find(
      (e) => e.id === opinion.id,
    );

    if (!userOpinion)
      throw new BusinessLogicException(
        'The opinionMade with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userOpinion;
  }

  async findOpinionsByUserId(userId: string): Promise<OpinionEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsMade'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.opinionsMade;
  }

  async associateOpinionsUser(
    userId: string,
    opinions: OpinionEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsMade'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < opinions.length; i++) {
      const opinion: OpinionEntity = await this.opinionRepository.findOne({
        where: { id: opinions[i].id },
      });
      if (!opinion)
        throw new BusinessLogicException(
          'The opinionMade with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.opinionsMade = opinions;
    return await this.userRepository.save(user);
  }

  async deleteOpinionUser(userId: string, opinionId: string) {
    const opinion: OpinionEntity = await this.opinionRepository.findOne({
      where: { id: opinionId },
    });
    if (!opinion)
      throw new BusinessLogicException(
        'The opinionMade with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsMade'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userOpinion: OpinionEntity = user.opinionsMade.find(
      (e) => e.id === opinion.id,
    );

    if (!userOpinion)
      throw new BusinessLogicException(
        'The opinionMade with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    user.opinionsMade = user.opinionsMade.filter((e) => e.id !== opinionId);
    await this.userRepository.save(user);
  }
}
