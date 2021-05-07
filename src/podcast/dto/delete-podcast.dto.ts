import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from '../entity/podcast.entity';

@InputType()
export class DeletePodcastInput extends PickType(Podcast, ['id'] as const) {}

@ObjectType()
export class DeletePodcastOutput extends CoreOutput {}
