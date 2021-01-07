import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateEpisodeDto } from "../dtos/create-episode.dto";
import { CreatePodcastDto } from "../dtos/create-podcast.dto";
import { CoreOutput, EpisodesOutput, PodcastOutput } from "../dtos/output.dto";
import { EpisodesSearchDto, PodcastSearchDto } from "../dtos/podcast.dto";
import { Podcast } from "../entities/podcast.entity";
import { PodcastsService } from "./podcasts.service";
import { UpdatePotcastDto } from "../dtos/update-podcast.dto";
import { UpdateEpisodeDto } from "../dtos/update-episode.dto";

@Resolver(Of => Podcast)
export class PodcastsResolver {
    constructor(private readonly podcastsService: PodcastsService) {}

    @Query(returns => [Podcast])
    getAllPodcasts() {
        return this.podcastsService.getPodcasts();
    }

    @Query(returns => PodcastOutput)
    getPodcast(@Args() podcastSearchDto: PodcastSearchDto): PodcastOutput {
        return this.podcastsService.getPodcast(podcastSearchDto.id);
    }
    
    @Query(returns => EpisodesOutput)
    getEpisodes(@Args('id') podcastId: number): EpisodesOutput {
        return this.podcastsService.getEpisodes(podcastId)
    }

    @Mutation(returns => CoreOutput)
    createPotcast(@Args() podcastData: CreatePodcastDto): CoreOutput {
        return this.podcastsService.createPodcast(podcastData);
    }

    @Mutation(returns => CoreOutput)
    createEpisode(@Args() episodeData: CreateEpisodeDto): CoreOutput {
        return this.podcastsService.createEpisode(episodeData);
    }

    @Mutation(returns => CoreOutput)
    deletePotcast(@Args('id') podcastId: number) {
        return this.podcastsService.deletePodcast(podcastId);
    }

    @Mutation(returns => CoreOutput)
    deleteEpisode(@Args() episodeSearchDto: EpisodesSearchDto) {
        return this.podcastsService.deleteEpisode(episodeSearchDto);
    }

    @Mutation(returns => CoreOutput)
    updatePotcast(@Args() updatePotcastDto: UpdatePotcastDto): CoreOutput {
        return this.podcastsService.updatePodcast(updatePotcastDto);
    }

    @Mutation(returns => CoreOutput)
    updateEpisode(@Args() updateEpisodeDto: UpdateEpisodeDto): CoreOutput {
        return this.podcastsService.updateEpisode(updateEpisodeDto);
    }
}