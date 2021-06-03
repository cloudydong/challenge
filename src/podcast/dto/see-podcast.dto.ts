import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../../user/entity/user.entity';
import { Podcast } from '../entity/podcast.entity';

@InputType()
export class SeePodcastInput extends PickType(User, ['id'] as const) {}

@ObjectType()
export class SeePodcastOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
