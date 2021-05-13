import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { baseMethodTestTemplate } from '../../test/test.util';
import { Repository } from 'typeorm';
import { Episode } from './entity/episode.entity';
import { Podcast } from './entity/podcast.entity';
import { PodcastService } from './podcast.service';

const mockPodcastRepository = () => ({
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

const mockEpisodeRepository = () => ({
  findOneOrFail: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PodcastService', () => {
  let podcastService: PodcastService;
  let podcastRepository: MockRepository<Podcast>;
  let episodeRepository: MockRepository<Episode>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockPodcastRepository(),
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockEpisodeRepository(),
        },
      ],
    }).compile();
    podcastService = module.get<PodcastService>(PodcastService);
    podcastRepository = module.get(getRepositoryToken(Podcast));
    episodeRepository = module.get(getRepositoryToken(Episode));
  });

  it('should be defined', () => {
    expect(podcastService).toBeDefined();
  });

  describe('findPodcasts', () => {
    it('should find podcasts', async () => {
      const podcasts = [
        {
          id: 1,
          title: 'title',
        },
      ];
      podcastRepository.find.mockResolvedValue(podcasts);
      const result = await podcastService.findPodcasts();
      expect(result).toEqual({
        ok: true,
        podcasts,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.find.mockRejectedValue(new Error());
      const result = await podcastService.findPodcasts();
      expect(result).toEqual({ ok: false, error: 'can not find all podcasts' });
    });
  });

  describe('findPodcast', () => {
    const findPodcastArgs = { id: 1 };
    it('should find podcast', async () => {
      const podcast = {
        id: 1,
        title: 'title',
      };
      podcastRepository.findOneOrFail.mockResolvedValue(podcast);
      const result = await podcastService.findPodcast(findPodcastArgs);
      expect(result).toEqual({
        ok: true,
        podcast,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await podcastService.findPodcast(findPodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not find podcast by podcastId',
      });
    });
  });

  describe('createPodcast', () => {
    const createPodcastArgs = {
      title: 'title',
      category: 'category',
      rating: 5,
    };
    it('should create podcast', async () => {
      const podcast = {
        id: 1,
        title: 'title',
        category: 'category',
        rating: 5,
      };
      podcastRepository.create.mockReturnValue(podcast);
      podcastRepository.save.mockResolvedValue(podcast);

      const result = await podcastService.createPodcast(createPodcastArgs);
      baseMethodTestTemplate(podcastRepository.create, {
        ...createPodcastArgs,
      });
      baseMethodTestTemplate(podcastRepository.save, podcast);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.save.mockRejectedValue(new Error());
      const result = await podcastService.createPodcast(createPodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not create podcast by createPodcastInput',
      });
    });
  });

  describe('updatePodcast', () => {
    const updatePodcastArgs = {
      id: 1,
      title: 'title',
      category: 'category',
      rating: 5,
    };
    it('should update podcast', async () => {
      podcastRepository.save.mockResolvedValue({ ...updatePodcastArgs });
      const result = await podcastService.updatePodcast(updatePodcastArgs);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await podcastService.updatePodcast(updatePodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not update podcast by updatePodcastInput',
      });
    });
  });

  describe('deletePodcast', () => {
    const deletePodcastArgs = {
      id: 1,
    };
    it('should find null', async () => {
      podcastRepository.findOne.mockResolvedValue(null);
      const result = await podcastService.deletePodcast(deletePodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not find podcast by podcastId',
      });
    });

    it('should delete podcast', async () => {
      podcastRepository.findOne.mockResolvedValue({ podcast: 'podcast' });
      const result = await podcastService.deletePodcast(deletePodcastArgs);
      baseMethodTestTemplate(podcastRepository.findOne, deletePodcastArgs.id);
      baseMethodTestTemplate(podcastRepository.delete, deletePodcastArgs.id);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error());
      const result = await podcastService.deletePodcast(deletePodcastArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not delete podcast by podcastId',
      });
    });
  });

  describe('findEpisodes', () => {
    const findEpisodesArgs = {
      id: 1,
    };
    it('should find Episodes', async () => {
      const podcast = {
        episodes: [
          {
            episodes: 1,
          },
          { episodes: 2 },
        ],
      };
      podcastRepository.findOneOrFail.mockResolvedValue(podcast);
      const result = await podcastService.findEpisodes(findEpisodesArgs);
      expect(result).toEqual({
        ok: true,
        episodes: podcast.episodes,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await podcastService.findEpisodes(findEpisodesArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not find episodes by podcastId',
      });
    });
  });

  describe('findEpisode', () => {
    const findEpisodeArgs = {
      id: 1,
    };
    it('should find Episode', async () => {
      const episode = {
        id: 1,
        title: 'title',
      };
      episodeRepository.findOneOrFail.mockResolvedValue(episode);
      const result = await podcastService.findEpisode(findEpisodeArgs);
      expect(result).toEqual({
        ok: true,
        episode,
      });
    });

    it('should fail on exception', async () => {
      episodeRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await podcastService.findEpisode(findEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not find episode by episodeId',
      });
    });
  });

  describe('createEpisode', () => {
    const createEpisodeArgs = {
      title: 'title',
      podcastId: 1,
    };

    it('can not find podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(null);
      const result = await podcastService.createEpisode(createEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not find podcast by podcastId',
      });
    });

    it('should create Episode', async () => {
      const podcast = {
        id: 1,
        title: 'title',
        episodes: [],
      };
      const { podcastId, ...createEpisodeInputArgs } = createEpisodeArgs;
      podcastRepository.findOne.mockResolvedValue(podcast);
      episodeRepository.create.mockResolvedValue({
        createEpisodeInputArgs,
      });
      episodeRepository.save.mockResolvedValue({
        ...podcast,
        episodes: [createEpisodeInputArgs],
      });
      const result = await podcastService.createEpisode(createEpisodeArgs);
      baseMethodTestTemplate(podcastRepository.findOne, podcastId);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      podcastRepository.findOne.mockRejectedValue(new Error());
      const result = await podcastService.createEpisode(createEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not create episode by createEpisodeInput',
      });
    });
  });

  describe('updateEpisode', () => {
    const updateEpisodeArgs = {
      id: 1,
      title: 'title',
    };

    it('should update episode', async () => {
      const result = await podcastService.updateEpisode(updateEpisodeArgs);

      baseMethodTestTemplate(episodeRepository.save, { ...updateEpisodeArgs });
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      episodeRepository.save.mockRejectedValue(new Error());
      const result = await podcastService.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not update episode by updateEpisodeOutput',
      });
    });
  });

  describe('deleteEpisode', () => {
    const deleteEpisodeArgs = {
      id: 1,
    };

    it('should delete episode', async () => {
      const result = await podcastService.deleteEpisode(deleteEpisodeArgs);

      baseMethodTestTemplate(episodeRepository.delete, deleteEpisodeArgs.id);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      episodeRepository.delete.mockRejectedValue(new Error());
      const result = await podcastService.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: 'can not delete episode by episodeId',
      });
    });
  });
});
