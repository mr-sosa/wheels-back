import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  providers: [AddressService],
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
})
export class AddressModule {}
