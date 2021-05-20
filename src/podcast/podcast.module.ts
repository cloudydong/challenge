import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastResolver } from './podcast.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entity/episode.entity';
import { Podcast } from './entity/podcast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode])],
  providers: [PodcastService, PodcastResolver],
  exports: [PodcastService],
})
export class PodcastModule {}
