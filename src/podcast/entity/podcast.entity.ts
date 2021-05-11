import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  title: string;

  @Field(() => String)
  @Column()
  @IsString()
  category: string;

  @Field(() => Number)
  @Column()
  @IsNumber()
  rating: number;

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.podcast, {
    cascade: true,
  })
  episodes: Episode[];
}
