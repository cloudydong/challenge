import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: 'can not create user because already email',
        };
      }
      await this.userRepository.save(
        this.userRepository.create({ email, password, role }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'fail create user' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) return { ok: false, error: 'can not find user by email' };

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect)
        return {
          ok: false,
          error: 'can not login user because wrong password',
        };

      const token = this.jwtService.sign({ id: user.id });

      return { ok: true, token };
    } catch (error) {
      return { ok: false, error: 'fail login user' };
    }
  }

  async findById({ userId: id }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail({ id });
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'can not find user by id' };
    }
  }

  async editProfile(
    userId: number,
    { password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId);
      if (password) {
        user.password = password;
      }
      await this.userRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'fail edit user profile' };
    }
  }
}
