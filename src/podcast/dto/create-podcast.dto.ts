import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from '../entity/podcast.entity';

@InputType()
export class CreatePodcastInput extends PickType(Podcast, [
  'title',
  'summary',
  'category',
  'thumbnail',
  'site',
] as const) {}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {}
