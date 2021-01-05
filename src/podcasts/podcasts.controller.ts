import { Controller, Get, Param, Patch, Post, Delete, Body } from '@nestjs/common';
import { Podcast } from '../entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastsController {

    constructor(private readonly podcastsService: PodcastsService) {}

    @Get()
    getAll(): Podcast[] {
        return this.podcastsService.getPodcasts();
    }

    @Get(':id')
    getPodcast(@Param('id') podcastId: string) {
        return this.podcastsService.getPodcast(podcastId);
    }

    @Get(':id/episodes')
    getEpisode(@Param('id') podcastId: string) {
        return this.podcastsService.getEpisodes(podcastId);
    }

    @Post()
    createPodcast(@Body() podcastData) {
        return this.podcastsService.createPodcast(podcastData);
    }

    @Post(':id/episodes')
    createEpisode(@Param('id') podcastId: string, @Body() episodeData) {
        return this.podcastsService.createEpisode(podcastId, episodeData);
    }

    @Delete(':id')
    removePodcast(@Param('id') podcastId: string) {
        return this.podcastsService.deletePodcast(podcastId);
    }

    @Delete(':id/episodes/:episodeId')
    removeEpisode(@Param('id') podcastId: string, @Param('episodeId') episodeId: string) {
        return this.podcastsService.deleteEpisode(podcastId, episodeId);
    }

    @Patch(':id')
    patchPodcast(@Param('id') podcastId: string, @Body() updatedPodcastData) {
        return this.podcastsService.updatePodcast(podcastId, updatedPodcastData);
    }

    @Patch(':id/episodes/:episodeId')
    patchEpisode(@Param('id') podcastId: string, @Param('episodeId') episodeId: string, @Body() updatedEpisodeData) {
        return this.podcastsService.updateEpisode(podcastId, episodeId, updatedEpisodeData)
    }

}


// 추가될 떄는 현재 아이템 개수 + 1로 추가되므로
// 중간에 삭제된 애가 있을 경우 중복 수가 생김.

// 해결법
// 1. 삭제한 후 Id를 재정렬한다.
// 2. 추가할때 ID를 가장 큰 수 + 1 로 넣는다.