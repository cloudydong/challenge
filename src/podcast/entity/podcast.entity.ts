import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Review } from 'src/listener/entity/review.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
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
  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ManyToOne(() => User, (user) => user.myPodcast)
  creator: User;

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.podcast, {
    cascade: true,
    eager: true,
  })
  episodes: Episode[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.podcast, {
    cascade: true,
    eager: true,
  })
  reviews: Review[];
}
