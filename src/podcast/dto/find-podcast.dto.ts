import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from '../entity/podcast.entity';

@InputType()
export class FindPodcastInput extends PickType(Podcast, ['id'] as const) {}

@ObjectType()
export class FindPodcastOutput extends CoreOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;
}
