import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateEpisodeInput } from './dtos/create-episode.dto';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import {
  EpisodesOutput,
  GetAllPodcastsOutput,
  PodcastOutput,
} from './dtos/output.dto';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { CoreOutput } from '../common/dtos/output.dto';

@Resolver((Of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => GetAllPodcastsOutput)
  async getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastsService.getPodcasts();
  }

  @Query((returns) => PodcastOutput)
  async getPodcast(@Args('id') podcastId: number): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastId);
  }

  @Query((returns) => EpisodesOutput)
  async getEpisodes(@Args('id') podcastId: number): Promise<EpisodesOutput> {
    return this.podcastsService.getEpisodes(podcastId);
  }

  @Mutation((returns) => CoreOutput)
  async createPodcast(
    @Args('input') podcastData: CreatePodcastInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.createPodcast(podcastData);
  }

  @Mutation((returns) => CoreOutput)
  async createEpisode(
    @Args('id') podcastId: number,
    @Args('input') episodeData: CreateEpisodeInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.createEpisode(podcastId, episodeData);
  }

  @Mutation((returns) => CoreOutput)
  async updatePodcast(
    @Args('input') updatePotcastDto: UpdatePodcastInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(updatePotcastDto);
  }

  @Mutation((returns) => CoreOutput)
  async deletePodcast(@Args('id') podcastId: number): Promise<CoreOutput> {
    return this.podcastsService.deletePodcast(podcastId);
  }

  @Mutation((returns) => CoreOutput)
  async deleteEpisode(
    @Args('podcastId') podcastId: number,
    @Args('episodeId') episodeId: number,
  ): Promise<CoreOutput> {
    return this.podcastsService.deleteEpisode(podcastId, episodeId);
  }

  @Mutation((returns) => CoreOutput)
  async updateEpisode(
    @Args('input') updateEpisodeDto: UpdateEpisodeInput,
  ): Promise<CoreOutput> {
    return this.podcastsService.updateEpisode(updateEpisodeDto);
  }
}
