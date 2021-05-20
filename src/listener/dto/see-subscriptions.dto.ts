import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from 'src/podcast/entity/podcast.entity';

@ObjectType()
export class SeeSubscriptionsOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  subscriptions?: Podcast[];
}
