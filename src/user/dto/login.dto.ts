import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../entity/user.entity';

@InputType()
export class LoginInput extends PickType(User, [
  'email',
  'password',
] as const) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
