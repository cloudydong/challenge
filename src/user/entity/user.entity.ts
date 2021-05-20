import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Review } from 'src/listener/entity/review.entity';
import { Episode } from 'src/podcast/entity/episode.entity';
import { Podcast } from 'src/podcast/entity/podcast.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  Host = 'Host',
  Listener = 'Listener',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInput', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  email: string;

  @Field(() => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'simple-enum', enum: UserRole })
  role: UserRole;

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.author)
  reviews: Review[];

  @Field(() => [Podcast])
  @ManyToMany(() => Podcast, (podcast) => podcast.subscribers)
  @JoinTable()
  subscriptions: Podcast[];

  @Field(() => [Episode])
  @ManyToMany(() => Episode)
  @JoinTable()
  markEpisode: Episode[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const passwordCorrect = await bcrypt.compare(password, this.password);
      return passwordCorrect;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
