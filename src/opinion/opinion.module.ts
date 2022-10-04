import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionEntity } from './opinion.entity';
import { OpinionService } from './opinion.service';

@Module({
  providers: [OpinionService],
  imports: [TypeOrmModule.forFeature([OpinionEntity])],
})
export class OpinionModule {}
