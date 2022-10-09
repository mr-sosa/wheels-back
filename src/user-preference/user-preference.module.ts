import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceEntity } from '../preference/preference.entity';
import { UserEntity } from '../user/user.entity';
import { UserPreferenceService } from './user-preference.service';

@Module({
  providers: [UserPreferenceService],
  imports: [TypeOrmModule.forFeature([UserEntity, PreferenceEntity])],
})
export class UserPreferenceModule {}
