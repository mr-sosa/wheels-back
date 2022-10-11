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
import { OpinionDto } from './opinion.dto';
import { OpinionEntity } from './opinion.entity';
import { OpinionService } from './opinion.service';

@Controller('opinions')
@UseInterceptors(BusinessErrorsInterceptor)
export class OpinionController {
  constructor(private readonly opinionService: OpinionService) {}

  @Get()
  async findAll() {
    return await this.opinionService.findAll();
  }

  @Get(':opinionId')
  async findOne(@Param('opinionId') opinionId: string) {
    return await this.opinionService.findOne(opinionId);
  }

  @Post()
  async create(@Body() opinionDto: OpinionDto) {
    const opinion: OpinionEntity = plainToInstance(OpinionEntity, opinionDto);
    return await this.opinionService.create(opinion);
  }

  @Put(':opinionId')
  async update(
    @Param('opinionId') opinionId: string,
    @Body() opinionDto: OpinionDto,
  ) {
    const opinion: OpinionEntity = plainToInstance(OpinionEntity, opinionDto);
    return await this.opinionService.update(opinionId, opinion);
  }

  @Delete(':opinionId')
  @HttpCode(204)
  async delete(@Param('opinionId') opinionId: string) {
    return await this.opinionService.delete(opinionId);
  }
}
