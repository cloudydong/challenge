import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOption } from './jwt.option';
import { JwtService } from './jwt.service';

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

@Global()
@Module({})
export class JwtModule {
  static forRoot(option: JwtModuleOption): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: option,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
