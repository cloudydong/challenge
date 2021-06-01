import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { baseMethodTestTemplate } from '../../test/test.util';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/user/entity/user.entity';
import { UserService } from './user.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: UserRole.Host,
    };

    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'already',
      });
      const result = await userService.createAccount(createAccountArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not create user because already email',
      });
    });

    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createAccountArgs);
      userRepository.save.mockResolvedValue(createAccountArgs);

      const result = await userService.createAccount(createAccountArgs);

      baseMethodTestTemplate(userRepository.create, createAccountArgs);
      baseMethodTestTemplate(userRepository.save, createAccountArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());

      const result = await userService.createAccount(createAccountArgs);

      expect(result).toEqual({ ok: false, error: 'fail create user' });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'email@test.com',
      password: 'password',
    };

    it('should fail if a user does not exists', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      const result = await userService.login(loginArgs);

      baseMethodTestTemplate(
        userRepository.findOne,
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'can not find user by email',
      });
    });

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);

      const result = await userService.login(loginArgs);

      expect(result).toEqual({
        ok: false,
        error: 'can not login user because wrong password',
      });
    });

    it('should return token if the password is correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);

      const result = await userService.login(loginArgs);

      baseMethodTestTemplate(jwtService.sign, expect.any(Object));
      expect(result).toEqual({ ok: true, token: 'token' });
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());

      const result = await userService.login(loginArgs);

      expect(result).toEqual({ ok: false, error: 'fail login user' });
    });
  });

  describe('findById', () => {
    const findArgs = { userId: 1 };

    it('should find user', async () => {
      const user = { user: 'user' };
      userRepository.findOneOrFail.mockResolvedValue(user);
      const result = await userService.findById(findArgs);

      baseMethodTestTemplate(userRepository.findOneOrFail, expect.any(Object));
      expect(result).toEqual({ ok: true, user });
    });

    it('should fail on exception', async () => {
      userRepository.findOneOrFail.mockRejectedValue(new Error());

      const result = await userService.findById(findArgs);

      expect(result).toEqual({ ok: false, error: 'can not find user by id' });
    });
  });

  describe('editProfile', () => {
    const editUserIdArgs = 1;
    const editProfileArgs = { password: 'change' };

    it('should change password', async () => {
      const user = { id: 1, password: 'password' };
      userRepository.findOneOrFail.mockResolvedValue(user);
      userRepository.save.mockResolvedValue({ id: 1, password: 'change' });

      const result = await userService.editProfile(
        editUserIdArgs,
        editProfileArgs,
      );

      baseMethodTestTemplate(userRepository.findOneOrFail, editUserIdArgs);
      baseMethodTestTemplate(userRepository.save, {
        id: 1,
        password: 'change',
      });
      expect(result).toEqual({ ok: true });
    });

    it('should nothing change', async () => {
      const user = { id: 1, password: 'password' };
      userRepository.findOneOrFail.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user);

      const result = await userService.editProfile(editUserIdArgs, {});
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepository.findOneOrFail.mockRejectedValue(new Error());

      const result = await userService.editProfile(
        editUserIdArgs,
        editProfileArgs,
      );

      expect(result).toEqual({ ok: false, error: 'fail edit user profile' });
    });
  });
});
