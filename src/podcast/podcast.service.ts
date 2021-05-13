import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async findPodcasts(): Promise<FindPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find();
      return { ok: true, podcasts };
    } catch (error) {
      return { ok: false, error: 'can not find all podcasts' };
    }
  }

  async findPodcast({
    id: podcastId,
  }: FindPodcastInput): Promise<FindPodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOneOrFail(podcastId);
      return { ok: true, podcast };
    } catch (error) {
      return { ok: false, error: 'can not find podcast by podcastId' };
    }
  }

  async createPodcast(
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      await this.podcastRepository.save(
        this.podcastRepository.create({ ...createPodcastInput }),
      );
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
      await this.episodeRepository.delete(episodeId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'can not delete episode by episodeId' };
    }
  }
}
