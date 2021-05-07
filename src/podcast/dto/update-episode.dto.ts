import {
  InputType,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entity/episode.entity';

@InputType()
export class UpdateEpisodeInput extends IntersectionType(
  PickType(Episode, ['id'] as const),
  PartialType(PickType(Episode, ['title'] as const)),
) {}

@ObjectType()
export class UpdateEpisodeOutput extends CoreOutput {}
