import { Injectable, NotFoundException } from '@nestjs/common';
import { CoreOutput, EpisodesOutput, PodcastOutput } from '../dtos/output.dto';
import { CreatePodcastDto } from '../dtos/create-podcast.dto';
import { Podcast } from '../entities/podcast.entity';
import { CreateEpisodeDto } from 'src/dtos/create-episode.dto';
import { UpdatePotcastDto } from 'src/dtos/update-podcast.dto';
import { UpdateEpisodeDto } from 'src/dtos/update-episode.dto';
import { EpisodesSearchDto } from 'src/dtos/podcast.dto';

@Injectable()
export class PodcastsService {
    private podcasts: Podcast[] = [];
    
    getPodcasts(): Podcast[] {
        return this.podcasts;
    }
    
    getPodcast(podcastId: number): PodcastOutput  {
        const podcast = this.podcasts.find(podcast => podcast.id === podcastId);
        if(!podcast) {
            return {
                ok: false,
                error: `Potcast with ID: ${podcastId} not found.`
            }
        }
        
        return {
            ok: true,
            podcast: podcast
        }
    }
    
    getEpisodes(podcastId: number): EpisodesOutput {
        const podcast = this.podcasts.find(podcast => podcast.id === podcastId);
        if(!podcast) {
            return {
                ok: false,
                error: `Potcast with ID: ${podcastId} not found.`
            };
        }
        
        return {
            ok: true,
            episodes: podcast.episodes
        };
    }

    getEpisode(podcastId: number, episodeId: number) {
        const {ok, error, episodes } = this.getEpisodes(podcastId)
        if(!ok) {
            return { ok, error };
        }
        const episode = episodes.find(episode => episode.id == episodeId);
        if(!episode) {
            return {
                ok: false,
                error: `Episode with ID: ${episodeId} not found in Potcast ID ${podcastId}`
            };
        }
        return {
            ok: true,
            episode
        };
    }
    
    createPodcast({ title, category, rating }: CreatePodcastDto): CoreOutput {
        this.podcasts.push({
            id: this.podcasts.length + 1,
            title,
            category,
            rating,
            episodes: []
        });
        return { ok: true, error: null };
    }
    
    createEpisode({id, title, context}: CreateEpisodeDto): CoreOutput {
        const podcast = this.podcasts.find(podcast => podcast.id === id);
        if(!podcast) {
            return {
                ok: false,
                error: `Potcast with ID: ${id} not found.`
            }
        }
        
        podcast.episodes.push({
            id: podcast.episodes.length + 1,
            title,
            context
        })
        return {
            ok: true,
            error: null
        }
    }
    
    deletePodcast(podcastId: number) {
        const { ok, error } = this.getPodcast(podcastId);
        if(!ok) {
            return { ok, error };
        }
        this.podcasts = this.podcasts.filter(podcast => podcast.id !== podcastId);
        return { ok: true };
    }
    
    updatePodcast({ id, ...rest }: UpdatePotcastDto ): CoreOutput {
        const {ok, error, podcast} = this.getPodcast(id);
        if(!ok) {
            return {ok, error};
        }
        this.podcasts = this.podcasts.filter(podcast => podcast.id !== id);
        this.podcasts.push({...podcast, ...rest});
        return { ok };
    }
    
    deleteEpisode({podcastId, episodeId}: EpisodesSearchDto ) {
        const { podcast, error, ok } = this.getPodcast(podcastId);
        if(!ok) {
            return {ok, error};
        }
        this.updatePodcast({
            id: podcastId,
            episodes: podcast.episodes.filter((episode) => episode.id !== episodeId),
        })
        return { ok: true };
    }

    updateEpisode({podcastId, episodeId, ...rest}: UpdateEpisodeDto): CoreOutput {
        const { podcast, error, ok } = this.getPodcast(podcastId);
        if (!ok) {
            return { ok, error };
        }
        const episodeIdx = podcast.episodes.findIndex(({ id }) => id === episodeId);
        const newEpisode = { ...podcast.episodes[episodeIdx], ...rest };
        this.deleteEpisode({ podcastId, episodeId });
        const { podcast: changedPodcast } = this.getPodcast(podcastId);
        this.updatePodcast({
            id: podcastId,
            episodes: [...changedPodcast.episodes, newEpisode],
        });
        return { ok: true };
    }
    
}
