import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from '../entities/podcast.entity';

@Injectable()
export class PodcastsService {
    private podcasts: Podcast[] = [];
    
    getPodcasts(): Podcast[] {
        return this.podcasts;
    }
    
    getPodcast(podcastId: string) {
        const podcast = this.podcasts.find(podcast => podcast.id === +podcastId);
        if(!podcast) {
            throw new NotFoundException(`Potcast with ID: ${podcastId} not found.`);
        }
        
        return podcast;
    }
    
    getEpisodes(podcastId: string) {
        const podcast = this.podcasts.find(podcast => podcast.id === +podcastId);
        if(!podcast) {
            throw new NotFoundException(`Potcast with ID: ${podcastId} not found.`);
        }
        
        return podcast.episodes;
    }

    getEpisode(podcastId: string, episodeId: string) {
        const episode = this.getEpisodes(podcastId).find(episode => episode.id === +episodeId);
        if(!episode) {
            throw new NotFoundException(`Episode with ID: ${episodeId} not found in Potcast ID ${podcastId}`);
        }
        return episode;
    }
    
    createPodcast(podcastData) {
        this.podcasts.push({
            id: this.podcasts.length + 1,
            ...podcastData
        })
    }
    
    createEpisode(podcastId: string, episodeData) {
        const podcast = this.podcasts.find(podcast => podcast.id === +podcastId);
        if(!podcast) {
            throw new NotFoundException(`Potcast with ID: ${podcastId} not found.`);
        }
        
        this.podcasts[+podcastId-1].episodes.push({
            id: this.podcasts[+podcastId-1].episodes.length + 1,
            ...episodeData
        })
    }
    
    deletePodcast(podcastId: string) {
        this.getPodcast(podcastId);
        this.podcasts = this.podcasts.filter(podcast => podcast.id !== +podcastId);
    }
    
    updatePodcast(podcastId: string, updatedPodcastData) {
        const podcast = this.getPodcast(podcastId);
        this.deletePodcast(podcastId);
        this.podcasts.push({...podcast, ...updatedPodcastData});
    }
    
    deleteEpisode(podcastId: string, episodeId: string) {
        this.getEpisode(podcastId, episodeId);
        this.podcasts[+podcastId-1].episodes = this.podcasts[+podcastId-1].episodes.filter(episode => episode.id !== +episodeId);
    }

    updateEpisode(podcastId: string, episodeId: string, updatedEpisodeData) {
        const episode = this.getEpisode(podcastId, episodeId);
        this.deleteEpisode(podcastId, episodeId);
        this.podcasts[+podcastId-1].episodes.push({...episode, ...updatedEpisodeData});
    }
    
}
