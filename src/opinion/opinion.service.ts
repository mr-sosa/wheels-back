import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { OpinionEntity } from './opinion.entity';

const scores = ['EXCELLENT', 'VERYWELL', 'CORRECT', 'BAD', 'VERYBAD'];
@Injectable()
export class OpinionService {
  constructor(
    @InjectRepository(OpinionEntity)
    private readonly opinionRepository: Repository<OpinionEntity>,
  ) {}

  async findAll(): Promise<OpinionEntity[]> {
    return await this.opinionRepository.find({
      relations: ['users', 'commentators'],
    });
  }

  async findOne(id: string): Promise<OpinionEntity> {
    const opinion: OpinionEntity = await this.opinionRepository.findOne({
      where: { id },
      relations: ['users', 'commentators'],
    });
    if (!opinion)
      throw new BusinessLogicException(
        'The opinion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return opinion;
  }

  async create(opinion: OpinionEntity): Promise<OpinionEntity> {
    await this.verifyEnumerations(opinion);
    return await this.opinionRepository.save(opinion);
  }

  async update(id: string, opinion: OpinionEntity): Promise<OpinionEntity> {
    const persistedOpinion: OpinionEntity =
      await this.opinionRepository.findOne({
        where: { id },
        relations: ['users', 'commentators'],
      });
    if (!persistedOpinion)
      throw new BusinessLogicException(
        'The opinion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.verifyEnumerations(opinion);
    return await this.opinionRepository.save({
      ...persistedOpinion,
      ...opinion,
    });
  }

  async delete(id: string) {
    const opinion: OpinionEntity = await this.opinionRepository.findOne({
      where: { id },
      relations: ['users', 'commentators'],
    });
    if (!opinion)
      throw new BusinessLogicException(
        'The opinion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.opinionRepository.remove(opinion);
  }

  private async verifyEnumerations(opinion: OpinionEntity) {
    if (!scores.includes(opinion.score)) {
      throw new BusinessLogicException(
        'Invalid typeScore of opinion',
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
