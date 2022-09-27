import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceEntity } from './preference.entity';
import { PreferenceService } from './preference.service';

@Module({
  providers: [PreferenceService],
  imports: [TypeOrmModule.forFeature([PreferenceEntity])],
})
export class PreferenceModule {}
