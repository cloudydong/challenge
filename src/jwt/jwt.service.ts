import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.module';
import { JwtModuleOption } from './jwt.option';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly option: JwtModuleOption,
  ) {}
  sign(payload: Record<string, any>): string {
    return jwt.sign(payload, this.option.privateKey);
  }
  verify(token: string) {
    return jwt.verify(token, this.option.privateKey);
  }
}
