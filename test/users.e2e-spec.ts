import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { User } from 'src/user/entity/user.entity';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';

const GRAPHQL_ENDPOINT = '/graphql';

const TestUser = {
  email: 'test@gmail.com',
  password: 'test',
};

describe('UserResolver', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  it.todo('login');
  it.todo('me');

  it.todo('seeProfile');
  it.todo('createAccount');
  it.todo('editProfile');
});
