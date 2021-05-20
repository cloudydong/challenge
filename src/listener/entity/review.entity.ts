import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Podcast } from 'src/podcast/entity/podcast.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('ReviewInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  comment: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.reviews, {
    onDelete: 'CASCADE',
  })
  podcast: Podcast;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  author: User;
}
