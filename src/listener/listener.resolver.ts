import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { PodcastService } from 'src/podcast/podcast.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { MarkEpisodeInput, MarkEpisodeOutput } from './dto/mark-episode.dto';
import {
  ReivewPodcastsInput,
  ReivewPodcastsOutput,
} from './dto/review-podcast.dto';
import {
  searchCategoryInput,
  searchCategoryOutput,
} from './dto/search-category';
import {
  SearchPodcastsInput,
  SearchPodcastsOutput,
} from './dto/search-podcasts.dto';
import { SeeSubscriptionsOutput } from './dto/see-subscriptions.dto';
import {
  SubscribePodcastInput,
  SubscribePodcastOutput,
} from './dto/subscribe-podcast.dto';
import { Review } from './entity/review.entity';

@Resolver(() => Review)
export class ListenerResolver {
  constructor(
    private readonly podcastService: PodcastService,
    private readonly userService: UserService,
  ) {}

  @Query(() => SearchPodcastsOutput)
  @Role(['Listener'])
  async searchPodcasts(
    @Args('input') searchPodcastsInput: SearchPodcastsInput,
  ): Promise<SearchPodcastsOutput> {
    return this.podcastService.searchByTitle(searchPodcastsInput.title);
  }

  @Query(() => searchCategoryOutput)
  @Role(['Listener'])
  async searchCategory(
    @Args('input') searchCategory: searchCategoryInput,
  ): Promise<searchCategoryOutput> {
    return this.podcastService.searchCategory(searchCategory.category);
  }

  @Mutation(() => ReivewPodcastsOutput)
  @Role(['Listener'])
  async reviewPodcast(
    @AuthUser() user: User,
    @Args('input') reivewPodcastsInput: ReivewPodcastsInput,
  ): Promise<ReivewPodcastsOutput> {
    return this.userService.createReviewPodcast(
      user.id,
      reivewPodcastsInput.podcastId,
      reivewPodcastsInput.comment,
    );
  }

  @Mutation(() => SubscribePodcastOutput)
  @Role(['Listener'])
  async subscribeToPodcast(
    @AuthUser() user: User,
    @Args('input') subscribePodcastInput: SubscribePodcastInput,
  ): Promise<SubscribePodcastOutput> {
    return this.userService.subscribeToPodcast(
      user.id,
      subscribePodcastInput.podcastId,
    );
  }

  @Query(() => SeeSubscriptionsOutput)
  @Role(['Listener'])
  seeSubscriptions(@AuthUser() user: User): Promise<SeeSubscriptionsOutput> {
    return this.userService.seeSubscriptions(user.id);
  }

  @Mutation(() => SubscribePodcastOutput)
  @Role(['Listener'])
  async markEpisodeAsPlayed(
    @AuthUser() user: User,
    @Args('input') markEpisodeInput: MarkEpisodeInput,
  ): Promise<MarkEpisodeOutput> {
    return this.userService.markEpisodeAsPlayed(
      user.id,
      markEpisodeInput.episodeId,
    );
  }
}
