import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entity/episode.entity';

@InputType()
export class FindEpisodeInput extends PickType(Episode, ['id'] as const) {}

@ObjectType()
export class FindEpisodeOutput extends CoreOutput {
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
