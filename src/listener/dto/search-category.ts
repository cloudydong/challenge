import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from 'src/podcast/entity/podcast.entity';

@InputType()
export class searchCategoryInput {
  @Field(() => String)
  category: string;
}

@ObjectType()
export class searchCategoryOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
