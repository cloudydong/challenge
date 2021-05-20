import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from 'src/podcast/entity/podcast.entity';

@InputType()
export class SearchPodcastsInput {
  @Field(() => String)
  title: string;
}

@ObjectType()
export class SearchPodcastsOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
