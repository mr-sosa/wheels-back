import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionEntity } from '../opinion/opinion.entity';
import { UserEntity } from '../user/user.entity';
import { UserOpinionMadeService } from './user-opinion-made.service';

@Module({
  providers: [UserOpinionMadeService],
  imports: [TypeOrmModule.forFeature([UserEntity, OpinionEntity])],
})
export class UserOpinionMadeModule {}
