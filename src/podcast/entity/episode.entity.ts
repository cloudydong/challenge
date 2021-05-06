import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity } from 'typeorm';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode extends CoreEntity {
  @Field(() => String)
  @IsString()
  title: string;
}
