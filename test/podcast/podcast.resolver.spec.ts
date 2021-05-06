import { Test, TestingModule } from '@nestjs/testing';
import { PodcastResolver } from 'src/podcast/podcast.resolver';

describe('PodcastResolver', () => {
  let resolver: PodcastResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PodcastResolver],
    }).compile();

    resolver = module.get<PodcastResolver>(PodcastResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
