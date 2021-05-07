import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entity/episode.entity';

@InputType()
export class DeleteEpisodeInput extends PickType(Episode, ['id'] as const) {}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {}
