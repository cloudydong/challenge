import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entity/episode.entity';
import { Podcast } from '../entity/podcast.entity';

@InputType()
export class FindEpisodesInput extends PickType(Podcast, ['id'] as const) {}

@ObjectType()
export class FindEpisodesOutput extends CoreOutput {
  @Field(() => [Episode], { nullable: true })
  episodes?: Episode[];
}
