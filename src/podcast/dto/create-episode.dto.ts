import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entity/episode.entity';

@InputType()
export class CreateEpisodeInput extends OmitType(Episode, [
  'id',
  'createAt',
  'updateAt',
  'podcast',
] as const) {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {}
