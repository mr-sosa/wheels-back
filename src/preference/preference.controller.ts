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
import { PreferenceDto } from './preference.dto';
import { PreferenceEntity } from './preference.entity';
import { PreferenceService } from './preference.service';

@Controller('preferences')
@UseInterceptors(BusinessErrorsInterceptor)
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get()
  async findAll() {
    return await this.preferenceService.findAll();
  }

  @Get(':preferenceId')
  async findOne(@Param('preferenceId') preferenceId: string) {
    return await this.preferenceService.findOne(preferenceId);
  }

  @Post()
  async create(@Body() preferenceDto: PreferenceDto) {
    const preference: PreferenceEntity = plainToInstance(
      PreferenceEntity,
      preferenceDto,
    );
    return await this.preferenceService.create(preference);
  }

  @Put(':preferenceId')
  async update(
    @Param('preferenceId') preferenceId: string,
    @Body() preferenceDto: PreferenceDto,
  ) {
    const preference: PreferenceEntity = plainToInstance(
      PreferenceEntity,
      preferenceDto,
    );
    return await this.preferenceService.update(preferenceId, preference);
  }

  @Delete(':preferenceId')
  @HttpCode(204)
  async delete(@Param('preferenceId') preferenceId: string) {
    return await this.preferenceService.delete(preferenceId);
  }
}
