import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('PodcastResolver', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it.todo('getAllPodcasts');
  it.todo('getPodcast');
  it.todo('createPodcast');
  it.todo('updatePodcast');
  it.todo('deletePodcast');
  it.todo('getAllEpisodes');
  it.todo('getEpisode');
  it.todo('createEpisode');
  it.todo('updateEpisode');
  it.todo('deleteEpisode');
});
