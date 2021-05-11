import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../entity/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['password'] as const),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
