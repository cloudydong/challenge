import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../entity/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
] as const) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
