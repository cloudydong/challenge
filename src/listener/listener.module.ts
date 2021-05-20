import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastModule } from 'src/podcast/podcast.module';
import { UserModule } from 'src/user/user.module';
import { Review } from './entity/review.entity';
import { ListenerResolver } from './listener.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), PodcastModule, UserModule],
  providers: [ListenerResolver],
})
export class ListenerModule {}
