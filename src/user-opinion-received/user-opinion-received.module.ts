import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionEntity } from '../opinion/opinion.entity';
import { UserEntity } from '../user/user.entity';
import { UserOpinionReceivedService } from './user-opinion-received.service';

@Module({
  providers: [UserOpinionReceivedService],
  imports: [TypeOrmModule.forFeature([UserEntity, OpinionEntity])],
})
export class UserOpinionReceivedModule {}
