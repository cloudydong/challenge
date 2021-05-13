import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastModule } from './podcast/podcast.module';
import { CommonModule } from './common/common.module';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.db',
      synchronize: true,
      logging: false,
      entities: ['dist/**/*.entity.{ts,js}'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req.headers[TOKEN_KEY],
        };
      },
    }),
    JwtModule.forRoot({
      privateKey: 'orix353wOg1VPgxm004y9epGVLdqytzH',
    }),
    AuthModule,
    CommonModule,
    PodcastModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
