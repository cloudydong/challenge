import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';

@InputType()
export class MarkEpisodeInput {
  @Field(() => Number)
  episodeId: number;
}

@ObjectType()
export class MarkEpisodeOutput extends CoreOutput {}
