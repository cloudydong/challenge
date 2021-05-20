import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Review } from '../entity/review.entity';

@InputType()
export class ReivewPodcastsInput extends PickType(Review, [
  'comment',
] as const) {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class ReivewPodcastsOutput extends CoreOutput {}
