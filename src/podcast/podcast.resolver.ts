import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dto/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dto/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dto/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dto/delete-podcast.dto';
import { FindEpisodeInput, FindEpisodeOutput } from './dto/find-episode.dto';
import { FindEpisodesInput, FindEpisodesOutput } from './dto/find-episodes.dto';
import { FindPodcastInput, FindPodcastOutput } from './dto/find-podcast.dto';
import { FindPodcastsOutput } from './dto/find-podcasts.dto';
import { SeePodcastOutput } from './dto/see-podcast.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dto/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dto/update-podcast.dto';
import { Podcast } from './entity/podcast.entity';
import { PodcastService } from './podcast.service';

@Resolver(() => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => FindPodcastsOutput)
  async getAllPodcasts(): Promise<FindPodcastsOutput> {
    return this.podcastService.findPodcasts();
  }

  @Query(() => FindPodcastOutput)
  async getPodcast(
    @Args('input') findPodcastInput: FindPodcastInput,
  ): Promise<FindPodcastOutput> {
    return this.podcastService.findPodcast(findPodcastInput);
  }

  @Mutation(() => CreatePodcastOutput)
  @Role(['Host'])
  async createPodcast(
    @AuthUser() authUser: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastService.createPodcast(authUser, createPodcastInput);
  }

  @Mutation(() => UpdatePodcastOutput)
  @Role(['Host'])
  async updatePodcast(
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    return this.podcastService.updatePodcast(updatePodcastInput);
  }

  @Mutation(() => DeletePodcastOutput)
  @Role(['Host'])
  async deletePodcast(
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastService.deletePodcast(deletePodcastInput);
  }

  @Query(() => FindEpisodesOutput)
  async getAllEpisodes(
    @Args('input') findEpisodesInput: FindEpisodesInput,
  ): Promise<FindEpisodesOutput> {
    return this.podcastService.findEpisodes(findEpisodesInput);
  }

  @Query(() => FindEpisodeOutput)
  async getEpisode(
    @Args('input') findEpisodeInput: FindEpisodeInput,
  ): Promise<FindEpisodeOutput> {
    return this.podcastService.findEpisode(findEpisodeInput);
  }

  @Mutation(() => CreateEpisodeOutput)
  @Role(['Host'])
  async createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation(() => UpdateEpisodeOutput)
  @Role(['Host'])
  async updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdateEpisodeOutput> {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation(() => DeleteEpisodeOutput)
  @Role(['Host'])
  async deleteEpisode(
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return this.podcastService.deleteEpisode(deleteEpisodeInput);
  }

  @Query(() => SeePodcastOutput)
  @Role(['Host'])
  async seePodcast(@AuthUser() authUser: User): Promise<SeePodcastOutput> {
    return this.podcastService.seePodcast(authUser.id);
  }
}
