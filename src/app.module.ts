import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastModule } from './podcast/podcast.module';
import { CommonModule } from './common/common.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.db',
      synchronize: true,
      logging: false,
      entities: ['dist/**/*.entity.{ts,js}'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    CommonModule,
    PodcastModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
