import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastResolver } from './podcast.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entity/episode.entity';
import { Podcast } from './entity/podcast.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode, User])],
  providers: [PodcastService, PodcastResolver],
  exports: [PodcastService],
})
export class PodcastModule {}
