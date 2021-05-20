import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/listener/entity/review.entity';
import { Episode } from 'src/podcast/entity/episode.entity';
import { Podcast } from 'src/podcast/entity/podcast.entity';
import { User } from './entity/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Podcast, Episode, Review])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
