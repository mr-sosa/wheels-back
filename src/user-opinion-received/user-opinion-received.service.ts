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
export class UserOpinionReceivedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(OpinionEntity)
    private readonly opinionReceivedRepository: Repository<OpinionEntity>,
  ) {}

  async addOpinionUser(userId: string, opinionId: string): Promise<UserEntity> {
    const opinionReceived: OpinionEntity =
      await this.opinionReceivedRepository.findOne({
        where: { id: opinionId },
      });
    if (!opinionReceived)
      throw new BusinessLogicException(
        'The opinionReceived with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsReceived'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    user.opinionsReceived = [...user.opinionsReceived, opinionReceived];
    return await this.userRepository.save(user);
  }

  async findOpinionByUserIdOpinionId(
    userId: string,
    opinionId: string,
  ): Promise<OpinionEntity> {
    return await this.validate(userId, opinionId);
  }

  async findOpinionsByUserId(userId: string): Promise<OpinionEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsReceived'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.opinionsReceived;
  }

  async associateOpinionsUser(
    userId: string,
    opinions: OpinionEntity[],
  ): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsReceived'],
    });

    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < opinions.length; i++) {
      const opinionReceived: OpinionEntity =
        await this.opinionReceivedRepository.findOne({
          where: { id: opinions[i].id },
        });
      if (!opinionReceived)
        throw new BusinessLogicException(
          'The opinionReceived with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    user.opinionsReceived = opinions;
    return await this.userRepository.save(user);
  }

  async deleteOpinionUser(userId: string, opinionId: string) {
    await this.validate(userId, opinionId);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsReceived'],
    });

    user.opinionsReceived = user.opinionsReceived.filter(
      (e) => e.id !== opinionId,
    );
    await this.userRepository.save(user);
  }

  async validate(userId: string, opinionId: string) {
    const opinionReceived: OpinionEntity =
      await this.opinionReceivedRepository.findOne({
        where: { id: opinionId },
      });
    if (!opinionReceived)
      throw new BusinessLogicException(
        'The opinionReceived with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['opinionsReceived'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const userOpinion: OpinionEntity = user.opinionsReceived.find(
      (e) => e.id === opinionReceived.id,
    );

    if (!userOpinion)
      throw new BusinessLogicException(
        'The opinionReceived with the given id is not associated to the user',
        BusinessError.PRECONDITION_FAILED,
      );

    return userOpinion;
  }
}
