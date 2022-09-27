import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { RouteEntity } from './route.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  async findAll(): Promise<RouteEntity[]> {
    return await this.routeRepository.find({
      relations: ['driverTravel', 'steps'],
    });
  }

  async findOne(id: string): Promise<RouteEntity> {
    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id },
      relations: ['driverTravel', 'steps'],
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return route;
  }

  async create(route: RouteEntity): Promise<RouteEntity> {
    return await this.routeRepository.save(route);
  }

  async update(id: string, route: RouteEntity): Promise<RouteEntity> {
    const persistedRoute: RouteEntity = await this.routeRepository.findOne({
      where: { id },
      relations: ['driverTravel', 'steps'],
    });
    if (!persistedRoute)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.routeRepository.save({
      ...persistedRoute,
      ...route,
    });
  }

  async delete(id: string) {
    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id },
      relations: ['driverTravel', 'steps'],
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.routeRepository.remove(route);
  }
}
