import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionEntity } from './opinion.entity';
import { OpinionService } from './opinion.service';
import { OpinionController } from './opinion.controller';

@Module({
  providers: [OpinionService],
  imports: [TypeOrmModule.forFeature([OpinionEntity])],
  controllers: [OpinionController],
})
export class OpinionModule {}
