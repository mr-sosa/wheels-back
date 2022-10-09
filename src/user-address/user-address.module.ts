import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../address/address.entity';
import { UserEntity } from '../user/user.entity';
import { UserAddressService } from './user-address.service';

@Module({
  providers: [UserAddressService],
  imports: [TypeOrmModule.forFeature([UserEntity, AddressEntity])],
})
export class UserAddressModule {}
