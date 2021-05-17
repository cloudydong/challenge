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
  let loginJwtToken: string;

  const baseTestTemplate = () => {
    return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  };
  const publicTestTemplate = (query: string) => {
    return baseTestTemplate().send({ query });
  };
  const privateTestTemplate = (query: string) => {
    return baseTestTemplate().set('x-jwt', loginJwtToken).send({ query });
  };

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

  describe('createAccount', () => {
    it('should create a new account', async () => {
      return publicTestTemplate(`
        mutation {
          createAccount(
            input: { email: "${TestUser.email}", password: "${TestUser.password}", role: "Host" }
          ) {
            ok
            error
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.createAccount;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return publicTestTemplate(`
        mutation {
          createAccount(
            input: { email: "${TestUser.email}", password: "${TestUser.password}", role: "Host" }
          ) {
            ok
            error
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { createAccount },
            },
          } = res;
          expect(createAccount.ok).toBe(false);
          expect(createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login correct', async () => {
      return publicTestTemplate(`
          mutation {
            login(input: { email: "${TestUser.email}", password: "${TestUser.password}" }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, error, token } = res.body.data.login;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
          loginJwtToken = token;
        });
    });

    it('should fail login', async () => {
      return publicTestTemplate(`
          mutation {
            login(input: { email: "${TestUser.email}", password: "xxx" }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toEqual(expect.any(String));
          expect(login.token).toBe(null);
        });
    });
  });

  describe('seeProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await userRepository.find();
      userId = user.id;
    });

    it('should find a user profile', async () => {
      return privateTestTemplate(`
          {
            seeProfile(userId:${userId}) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, error, user } = res.body.data.seeProfile;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(user.id).toEqual(userId);
        });
    });

    it('should fail find the profile', async () => {
      return privateTestTemplate(`
          {
            seeProfile(userId:333) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, error, user } = res.body.data.seeProfile;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return privateTestTemplate(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { email } = res.body.data.me;
          expect(email).toBe(TestUser.email);
        });
    });

    it('should not allow logged out user', () => {
      return publicTestTemplate(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { errors } = res.body;
          const [error] = errors;
          expect(error.message).toEqual('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_PASSWORD = 'newPassword';
    it('should change password', () => {
      return privateTestTemplate(`
          mutation {
            editProfile(input: { password: "${NEW_PASSWORD}" }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.editProfile;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should have new password', () => {
      return privateTestTemplate(`
        mutation {
          login(input: { email: "${TestUser.email}", password: "${NEW_PASSWORD}" }) {
            ok
            error
            token
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, error, token } = res.body.data.login;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(token).toEqual(expect.any(String));
        });
    });
  });
});
