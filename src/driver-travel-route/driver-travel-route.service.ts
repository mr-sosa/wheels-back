import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DriverTravelEntity } from '../driver-travel/driver-travel.entity';
import { RouteEntity } from '../route/route.entity';

@Injectable()
export class DriverTravelRouteService {
  constructor(
    @InjectRepository(DriverTravelEntity)
    private readonly driverTravelRepository: Repository<DriverTravelEntity>,

    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  async addRouteDriverTravel(
    driverTravelId: string,
    routeId: string,
  ): Promise<DriverTravelEntity> {
    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['routes'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    driverTravel.routes = [...driverTravel.routes, route];
    return await this.driverTravelRepository.save(driverTravel);
  }

  async findRouteByDriverTravelIdRouteId(
    driverTravelId: string,
    routeId: string,
  ): Promise<RouteEntity> {
    return await this.validate(driverTravelId, routeId);
  }

  async findRoutesByDriverTravelId(
    driverTravelId: string,
  ): Promise<RouteEntity[]> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['routes'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return driverTravel.routes;
  }

  async associateRoutesDriverTravel(
    driverTravelId: string,
    routes: RouteEntity[],
  ): Promise<DriverTravelEntity> {
    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['routes'],
      });

    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < routes.length; i++) {
      const route: RouteEntity = await this.routeRepository.findOne({
        where: { id: routes[i].id },
      });
      if (!route)
        throw new BusinessLogicException(
          'The route with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    driverTravel.routes = routes;
    return await this.driverTravelRepository.save(driverTravel);
  }

  async deleteRouteDriverTravel(driverTravelId: string, routeId: string) {
    await this.validate(driverTravelId, routeId);

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['routes'],
      });

    driverTravel.routes = driverTravel.routes.filter((e) => e.id !== routeId);
    await this.driverTravelRepository.save(driverTravel);
  }

  async validate(driverTravelId: string, routeId: string) {
    const route: RouteEntity = await this.routeRepository.findOne({
      where: { id: routeId },
    });
    if (!route)
      throw new BusinessLogicException(
        'The route with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravel: DriverTravelEntity =
      await this.driverTravelRepository.findOne({
        where: { id: driverTravelId },
        relations: ['routes'],
      });
    if (!driverTravel)
      throw new BusinessLogicException(
        'The driverTravel with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const driverTravelRoute: RouteEntity = driverTravel.routes.find(
      (e) => e.id === route.id,
    );

    if (!driverTravelRoute)
      throw new BusinessLogicException(
        'The route with the given id is not associated to the driverTravel',
        BusinessError.PRECONDITION_FAILED,
      );

    return driverTravelRoute;
  }
}
