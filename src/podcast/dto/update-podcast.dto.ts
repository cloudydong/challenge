import {
  InputType,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from '../entity/podcast.entity';

@InputType()
export class UpdatePodcastInput extends IntersectionType(
  PickType(Podcast, ['id'] as const),
  PartialType(PickType(Podcast, ['title', 'category', 'rating'] as const)),
) {}

@ObjectType()
export class UpdatePodcastOutput extends CoreOutput {}
