import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RouteDto } from './route.dto';
import { RouteEntity } from './route.entity';
import { RouteService } from './route.service';

@Controller('routes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  async findAll() {
    return await this.routeService.findAll();
  }

  @Get(':routeId')
  async findOne(@Param('routeId') routeId: string) {
    return await this.routeService.findOne(routeId);
  }

  @Post()
  async create(@Body() routeDto: RouteDto) {
    const route: RouteEntity = plainToInstance(RouteEntity, routeDto);
    return await this.routeService.create(route);
  }

  @Put(':routeId')
  async update(@Param('routeId') routeId: string, @Body() routeDto: RouteDto) {
    const route: RouteEntity = plainToInstance(RouteEntity, routeDto);
    return await this.routeService.update(routeId, route);
  }

  @Delete(':routeId')
  @HttpCode(204)
  async delete(@Param('routeId') routeId: string) {
    return await this.routeService.delete(routeId);
  }
}
