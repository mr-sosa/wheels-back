import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { AddressService } from './address.service';

@Module({
  providers: [AddressService],
  imports: [TypeOrmModule.forFeature([AddressEntity])],
})
export class AddressModule {}
