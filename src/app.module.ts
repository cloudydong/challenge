import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';
import { Review } from './listener/entity/review.entity';
import { ListenerModule } from './listener/listener.module';
import { Episode } from './podcast/entity/episode.entity';
import { Podcast } from './podcast/entity/podcast.entity';
import { PodcastModule } from './podcast/podcast.module';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: true,
      synchronize: false,
      logging: false,
      entities: [Podcast, Episode, User, Review],
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
    ListenerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
