import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';
import * as jwt from 'jsonwebtoken';
import { baseMethodTestTemplate } from '../../test/test.util';

const TEST_KEY = 'testKey';
const TEST_ID = 1;
const TOKEN = 'TOKEN';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => TOKEN),
  verify: jest.fn(() => ({ id: TEST_ID })),
}));

describe('JwtService', () => {
  let jwtService: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed JWT token', () => {
      const payload = { id: TEST_ID };
      const token = jwtService.sign(payload);
      expect(typeof token).toBe('string');
      expect(token).toEqual('TOKEN');
      baseMethodTestTemplate(jwt.sign, payload, TEST_KEY);
    });
  });

  describe('verify', () => {
    it('should return the decoded payload', () => {
      const decodedToken = jwtService.verify(TOKEN);
      expect(decodedToken).toEqual({ id: TEST_ID });
      baseMethodTestTemplate(jwt.verify, TOKEN, TEST_KEY);
    });
  });
});
