import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';

@InputType()
export class SubscribePodcastInput {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class SubscribePodcastOutput extends CoreOutput {}
