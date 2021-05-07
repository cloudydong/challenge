import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, OneToMany } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  category: string;

  @Field(() => Number)
  @IsNumber()
  rating: number;

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.podcast, {
    onDelete: 'CASCADE',
  })
  episodes: Episode[];
}
