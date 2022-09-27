import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PointEntity } from './point.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(PointEntity)
    private readonly pointRepository: Repository<PointEntity>,
  ) {}

  async findAll(): Promise<PointEntity[]> {
    return await this.pointRepository.find({
      relations: ['stepStart', 'stepEnd', 'address'],
    });
  }

  async findOne(id: string): Promise<PointEntity> {
    const point: PointEntity = await this.pointRepository.findOne({
      where: { id },
      relations: ['stepStart', 'stepEnd', 'address'],
    });
    if (!point)
      throw new BusinessLogicException(
        'The point with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return point;
  }

  async create(point: PointEntity): Promise<PointEntity> {
    return await this.pointRepository.save(point);
  }

  async update(id: string, point: PointEntity): Promise<PointEntity> {
    const persistedPoint: PointEntity = await this.pointRepository.findOne({
      where: { id },
      relations: ['stepStart', 'stepEnd', 'address'],
    });
    if (!persistedPoint)
      throw new BusinessLogicException(
        'The point with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.pointRepository.save({
      ...persistedPoint,
      ...point,
    });
  }

  async delete(id: string) {
    const point: PointEntity = await this.pointRepository.findOne({
      where: { id },
      relations: ['stepStart', 'stepEnd', 'address'],
    });
    if (!point)
      throw new BusinessLogicException(
        'The point with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.pointRepository.remove(point);
  }
}
