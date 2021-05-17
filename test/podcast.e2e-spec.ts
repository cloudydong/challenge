import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Episode } from 'src/podcast/entity/episode.entity';
import { Podcast } from 'src/podcast/entity/podcast.entity';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';

const GRAPHQL_ENDPOINT = '/graphql';

const testPodcast = {
  title: 'test_title',
  category: 'test',
  rating: 5,
};

const testEpisode = {
  title: 'episode_test_title',
};

const NEW_EPISODE_TITLE = 'new_episode_title';

const NEW_PODCAST_TITLE = 'new_podcast_title';
const NEW_PODCAST_CATEGORY = 'new_podcast_category';
const NEW_PODCAST_RATING = 10;

describe('PodcastResolver', () => {
  let app: INestApplication;
  let podcastRepository: Repository<Podcast>;
  let episodeRepository: Repository<Episode>;
  const publicTestTemplate = (query: string) => {
    return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({ query });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    podcastRepository = module.get<Repository<Podcast>>(
      getRepositoryToken(Podcast),
    );
    episodeRepository = module.get<Repository<Episode>>(
      getRepositoryToken(Episode),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createPodcast', () => {
    it('should create new podcast', async () => {
      return publicTestTemplate(`
        mutation {
          createPodcast(
            input: { title: "${testPodcast.title}", category: "${testPodcast.category}", rating: ${testPodcast.rating} }
          ) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.createPodcast;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
  });

  describe('createEpisode', () => {
    it('should create new episode', async () => {
      return publicTestTemplate(`
        mutation {
          createEpisode(
            input: { podcastId: 1, title: "${testEpisode.title}" }
          ) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.createEpisode;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
  });

  describe('getAllPodcasts', () => {
    let podcastId: number;
    let episodeId: number;
    beforeAll(async () => {
      const [podcast] = await podcastRepository.find();
      podcastId = podcast.id;
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should find all podcasts', async () => {
      return publicTestTemplate(`
        {
          getAllPodcasts {
            ok
            error
            podcasts {
              id
              title
              episodes {
                id
                title
              }
            }
          }
        }      
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, podcasts } = res.body.data.getAllPodcasts;
          const [podcast] = podcasts;
          const [episode] = podcast.episodes;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(podcast.id).toEqual(podcastId);
          expect(podcast.title).toEqual(testPodcast.title);
          expect(episode.id).toEqual(episodeId);
          expect(episode.title).toEqual(testEpisode.title);
        });
    });
  });

  describe('getPodcast', () => {
    let podcastId: number;
    beforeAll(async () => {
      const [podcast] = await podcastRepository.find();
      podcastId = podcast.id;
    });

    it('should find the podcast', async () => {
      return publicTestTemplate(`
        {
          getPodcast(input: { id: ${podcastId} }) {
            ok
            error
            podcast {
              id
              title
            }
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, podcast } = res.body.data.getPodcast;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(podcast.id).toEqual(podcastId);
          expect(podcast.title).toEqual(testPodcast.title);
        });
    });

    it('should fail find the podcast', async () => {
      return publicTestTemplate(`
        {
          getPodcast(input: { id: 333 }) {
            ok
            error
            podcast {
              id
              title
            }
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, podcast } = res.body.data.getPodcast;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(podcast).toBe(null);
        });
    });
  });

  describe('getAllEpisodes', () => {
    let podcastId: number;
    let episodeId: number;
    beforeAll(async () => {
      const [podcast] = await podcastRepository.find();
      podcastId = podcast.id;
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should find all episodes', async () => {
      return publicTestTemplate(`
        {
          getAllEpisodes(input: { id: ${podcastId} }) {
            ok
            error
            episodes {
              id
              title
            }
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, episodes } = res.body.data.getAllEpisodes;
          const [episode] = episodes;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(episode.id).toEqual(episodeId);
          expect(episode.title).toEqual(testEpisode.title);
        });
    });
  });

  describe('getEpisode', () => {
    let episodeId: number;
    beforeAll(async () => {
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should find the episode', async () => {
      return publicTestTemplate(`
        {
          getEpisode(input: { id: ${episodeId} }) {
            ok
            error
            episode {
              id
              title
            }
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, episode } = res.body.data.getEpisode;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(episode.id).toEqual(episodeId);
          expect(episode.title).toEqual(testEpisode.title);
        });
    });

    it('should fail find the episode', async () => {
      return publicTestTemplate(`
        {
          getEpisode(input: { id: 333 }) {
            ok
            error
            episode {
              id
              title
            }
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, episode } = res.body.data.getEpisode;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(episode).toBe(null);
        });
    });
  });

  describe('updateEpisode', () => {
    let episodeId: number;
    beforeAll(async () => {
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should change title of the episode', async () => {
      return publicTestTemplate(`
        mutation {
          updateEpisode(input: { id:${episodeId}, title: "${NEW_EPISODE_TITLE}" }) {
            ok
            error
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.updateEpisode;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should have new title of the episode', async () => {
      return publicTestTemplate(`
        {
          getEpisode(input: { id: ${episodeId} }) {
            ok
            error
            episode {
              id
              title
            }
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, episode } = res.body.data.getEpisode;
          expect(ok).toBe(true);
          expect(error).toEqual(null);
          expect(episode.title).toEqual(NEW_EPISODE_TITLE);
        });
    });
  });

  describe('updatePodcast', () => {
    let podcastId: number;
    beforeAll(async () => {
      const [podcast] = await podcastRepository.find();
      podcastId = podcast.id;
    });

    it('should change title,category,rating of the podcast', async () => {
      return publicTestTemplate(`
        mutation {
          updatePodcast(input: { id:${podcastId}, title: "${NEW_PODCAST_TITLE}", category: "${NEW_PODCAST_CATEGORY}", rating: ${NEW_PODCAST_RATING} }) {
            ok
            error
          }
        }        
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.updatePodcast;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should have new title of the podcast', async () => {
      return publicTestTemplate(`
      {
        getPodcast(input: { id: ${podcastId} }) {
          ok
          error
          podcast {
            id
            title
            category
            rating
          }
        }
      }       
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error, podcast } = res.body.data.getPodcast;
          expect(ok).toBe(true);
          expect(error).toEqual(null);
          expect(podcast.title).toEqual(NEW_PODCAST_TITLE);
          expect(podcast.category).toEqual(NEW_PODCAST_CATEGORY);
          expect(podcast.rating).toEqual(NEW_PODCAST_RATING);
        });
    });
  });

  describe('deleteEpisode', () => {
    let episodeId: number;
    beforeAll(async () => {
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should delete episode', async () => {
      return publicTestTemplate(`
        mutation {
          deleteEpisode(input: { id:${episodeId} }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.deleteEpisode;
          expect(ok).toBe(true);
          expect(error).toEqual(null);
        });
    });

    it('should fail delete episode becasue wrong episodeId', async () => {
      return publicTestTemplate(`
        mutation {
          deleteEpisode(input: { id: 333 }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.deleteEpisode;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });

    it('should fail find episode', async () => {
      return publicTestTemplate(`
        {
          getEpisode(input: { id:${episodeId} }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.getEpisode;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });

  describe('deletePodcast', () => {
    let podcastId: number;
    beforeAll(async () => {
      const [podcast] = await podcastRepository.find();
      podcastId = podcast.id;
    });

    it('should delete podcast', async () => {
      return publicTestTemplate(`
        mutation {
          deletePodcast(input: { id:${podcastId} }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.deletePodcast;
          expect(ok).toBe(true);
          expect(error).toEqual(null);
        });
    });

    it('should fail delete podcast becasue wrong podcastId', async () => {
      return publicTestTemplate(`
        mutation {
          deletePodcast(input: { id: 333 }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.deletePodcast;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });

    it('should fail find podcast', async () => {
      return publicTestTemplate(`
        {
          getPodcast(input: { id:${podcastId} }) {
            ok
            error
            podcast { 
              id
            }
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.getPodcast;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });
});
