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
import { AddressDto } from './address.dto';
import { AddressEntity } from './address.entity';
import { AddressService } from './address.service';

@Controller('addresses')
@UseInterceptors(BusinessErrorsInterceptor)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async findAll() {
    return await this.addressService.findAll();
  }

  @Get(':addressId')
  async findOne(@Param('addressId') addressId: string) {
    return await this.addressService.findOne(addressId);
  }

  @Post()
  async create(@Body() addressDto: AddressDto) {
    const address: AddressEntity = plainToInstance(AddressEntity, addressDto);
    return await this.addressService.create(address);
  }

  @Put(':addressId')
  async update(
    @Param('addressId') addressId: string,
    @Body() addressDto: AddressDto,
  ) {
    const address: AddressEntity = plainToInstance(AddressEntity, addressDto);
    return await this.addressService.update(addressId, address);
  }

  @Delete(':addressId')
  @HttpCode(204)
  async delete(@Param('addressId') addressId: string) {
    return await this.addressService.delete(addressId);
  }
}
