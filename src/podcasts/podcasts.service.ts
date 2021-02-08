import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EpisodeOutput,
  EpisodesOutput,
  GetAllPodcastsOutput,
  PodcastOutput,
} from './dtos/output.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { Episode } from './entities/episode.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { CoreOutput } from '../common/dtos/output.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occurred.',
  };

  async getPodcasts(): Promise<GetAllPodcastsOutput> {
    try {
      const podcasts = await this.podcasts.find();
      return {
        ok: true,
        podcasts,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getPodcast(podcastId: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return {
          ok: false,
          error: `Potcast with ID: ${podcastId} not found.`,
        };
      }

      const episodesOfPodcast = await this.episodes.find({ podcast });
      podcast.episodes = episodesOfPodcast;

      return {
        ok: true,
        podcast: podcast,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return {
          ok: false,
          error: `Potcast with ID: ${podcastId} not found.`,
        };
      }
      const episodesOfPodcast = await this.episodes.find({ podcast });
      if (!episodesOfPodcast) {
        return {
          ok: false,
          error: `episode with podcast ID: ${podcastId} not found.`,
        };
      }

      return {
        ok: true,
        episodes: episodesOfPodcast,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisode(
    podcastId: number,
    episodeId: number,
  ): Promise<EpisodeOutput> {
    const { episodes, ok, error } = await this.getEpisodes(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const episode = episodes.find((episode) => episode.id === episodeId);
    if (!episode) {
      return {
        ok: false,
        error: `Episode with id ${episodeId} not found in podcast with id ${podcastId}`,
      };
    }
    return {
      ok: true,
      episode,
    };
  }

  async createPodcast(
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      const newPodcast = this.podcasts.create(createPodcastInput);

      if (!(await this.podcasts.save(newPodcast))) {
        return {
          ok: false,
          error: `Creation Error, New Podcast!`,
        };
      }

      return { ok: true, error: null };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createEpisode(
    podcastId: number,
    { title }: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const newEpisode = this.episodes.create({ title });
      newEpisode.podcast = podcast;
      const { id } = await this.episodes.save(newEpisode);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updatePodcast({
    id,
    payload,
  }: UpdatePodcastInput): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }

      if (
        payload.rating !== null &&
        (payload.rating < 1 || payload.rating > 5)
      ) {
        return {
          ok: false,
          error: 'Rating must be between 1 and 5.',
        };
      } else {
        const updatedPodcast: Podcast = { ...podcast, ...payload };
        await this.podcasts.save(updatedPodcast);
        return { ok };
      }
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeInput): Promise<CoreOutput> {
    try {
      const { episode, ok, error } = await this.getEpisode(
        podcastId,
        episodeId,
      );
      if (!ok) {
        return { ok, error };
      }
      const updatedEpisode = { ...episode, ...rest };
      await this.episodes.save(updatedEpisode);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deletePodcast(podcastId: number): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({ id: podcastId });
    if (!podcast) {
      return {
        ok: false,
        error: `Potcast with ID: ${podcastId} not found.`,
      };
    }

    await this.podcasts.delete(podcastId);
    return { ok: true };
  }

  async deleteEpisode(
    podcastId: number,
    episodeId: number,
  ): Promise<CoreOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return {
          ok: false,
          error: `Potcast with ID: ${podcastId} not found.`,
        };
      }

      const episodeOfPodcast = await this.episodes.findOne({
        podcast: podcast,
        id: episodeId,
      });
      if (!episodeOfPodcast) {
        return {
          ok: false,
          error: `Episode is undefined! [Potcast ID: ${podcastId}, Episode ID: ${episodeId}]`,
        };
      }

      await this.episodes.delete(episodeId);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }
}
