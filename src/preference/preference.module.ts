import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceEntity } from './preference.entity';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';

@Module({
  providers: [PreferenceService],
  imports: [TypeOrmModule.forFeature([PreferenceEntity])],
  controllers: [PreferenceController],
})
export class PreferenceModule {}
