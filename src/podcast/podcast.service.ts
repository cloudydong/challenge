import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchPodcastsOutput } from 'src/listener/dto/search-podcasts.dto';
import { User } from 'src/user/entity/user.entity';
import { ILike, Repository } from 'typeorm';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dto/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dto/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dto/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dto/delete-podcast.dto';
import { FindEpisodeInput, FindEpisodeOutput } from './dto/find-episode.dto';
import { FindEpisodesInput, FindEpisodesOutput } from './dto/find-episodes.dto';
import { FindPodcastInput, FindPodcastOutput } from './dto/find-podcast.dto';
import { FindPodcastsOutput } from './dto/find-podcasts.dto';
import { SeePodcastOutput } from './dto/see-podcast.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dto/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dto/update-podcast.dto';
import { Episode } from './entity/episode.entity';
import { Podcast } from './entity/podcast.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findPodcasts(): Promise<FindPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find({
        relations: ['episodes', 'reviews'],
      });
      return { ok: true, podcasts };
    } catch (error) {
      return { ok: false, error: 'can not find all podcasts' };
    }
  }

  async findPodcast({
    id: podcastId,
  }: FindPodcastInput): Promise<FindPodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOneOrFail(podcastId, {
        relations: ['episodes', 'reviews'],
      });
      return { ok: true, podcast };
    } catch (error) {
      return { ok: false, error: 'can not find podcast by podcastId' };
    }
  }

  async createPodcast(
    authUser: User,
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      const podcast = this.podcastRepository.create({ ...createPodcastInput });
      podcast.creator = authUser;
      await this.podcastRepository.save(podcast);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'can not create podcast by createPodcastInput',
      };
    }
  }

  async updatePodcast(
    updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    try {
      await this.podcastRepository.findOneOrFail({
        id: updatePodcastInput.id,
      });
      await this.podcastRepository.save({
        ...updatePodcastInput,
      });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'can not update podcast by updatePodcastInput',
      };
    }
  }

  async deletePodcast({
    id: podcastId,
  }: DeletePodcastInput): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(podcastId);
      if (!podcast)
        return { ok: false, error: 'can not find podcast by podcastId' };
      await this.podcastRepository.delete(podcastId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'can not delete podcast by podcastId' };
    }
  }

  async findEpisodes({
    id: podcastId,
  }: FindEpisodesInput): Promise<FindEpisodesOutput> {
    try {
      const podcast = await this.podcastRepository.findOneOrFail(podcastId);
      return { ok: true, episodes: podcast.episodes };
    } catch (error) {
      return { ok: false, error: 'can not find episodes by podcastId' };
    }
  }

  async findEpisode({
    id: episodeId,
  }: FindEpisodeInput): Promise<FindEpisodeOutput> {
    try {
      const episode = await this.episodeRepository.findOneOrFail(episodeId);
      return { ok: true, episode };
    } catch (error) {
      return { ok: false, error: 'can not find episode by episodeId' };
    }
  }

  async createEpisode({
    podcastId,
    ...createEpisodeInput
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(podcastId);
      if (!podcast)
        return { ok: false, error: 'can not find podcast by podcastId' };

      const episode = this.episodeRepository.create({ ...createEpisodeInput });
      episode.podcast = podcast;
      await this.episodeRepository.save(episode);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'can not create episode by createEpisodeInput',
      };
    }
  }

  async updateEpisode({
    ...updateEpisodeOutput
  }: UpdateEpisodeInput): Promise<UpdateEpisodeOutput> {
    try {
      await this.episodeRepository.save({ ...updateEpisodeOutput });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'can not update episode by updateEpisodeOutput',
      };
    }
  }

  async deleteEpisode({
    id: episodeId,
  }: DeleteEpisodeInput): Promise<DeleteEpisodeOutput> {
    try {
      const episode = await this.episodeRepository.findOne(episodeId);
      if (!episode)
        return { ok: false, error: 'can not find episode by episodeId' };
      await this.episodeRepository.delete(episodeId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'can not delete episode by episodeId' };
    }
  }

  async searchByTitle(query: string): Promise<SearchPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find({
        where: { title: ILike(`%${query}%`) },
      });
      return { ok: true, podcasts };
    } catch (error) {
      return { ok: false, error: 'can not search podcasts' };
    }
  }

  async seePodcast(userId: number): Promise<SeePodcastOutput> {
    try {
      const user = await this.userRepository.findOne(userId, {
        relations: ['myPodcast'],
      });
      return { ok: true, podcasts: user.myPodcast };
    } catch (error) {
      return { ok: false, error: 'can not see podcasts' };
    }
  }
}
