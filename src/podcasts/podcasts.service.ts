import { Injectable, NotFoundException } from '@nestjs/common';
import { EpisodesOutput, PodcastOutput } from './dtos/output.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { UpdatePotcastDto } from './dtos/update-podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { CoreOutput } from '../common/dtos/output.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>) {}

  //private podcasts: Podcast[] = [];
  
  async getPodcasts(): Promise<Podcast[]> {
    const allOfPodcast = await this.podcasts.find();
    for(let i=0; i<allOfPodcast.length; ++i) {
      const podcast = allOfPodcast[i];
      allOfPodcast[i].episodes = await this.episodes.find({podcast});
    }

    return allOfPodcast;
  }
  
  async getPodcast(podcastId: number): Promise<PodcastOutput>  {
    const podcast = await this.podcasts.findOne({id: podcastId});            
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${podcastId} not found.`
        }
    }

    const episodesOfPodcast = await this.episodes.find({podcast});
    podcast.episodes = episodesOfPodcast;
    
    return {
        ok: true,
        podcast: podcast
    }
  }
  
  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const podcast = await this.podcasts.findOne({id: podcastId});
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${podcastId} not found.`
        };
    }
    const episodesOfPodcast = await this.episodes.find({podcast});
    if(!episodesOfPodcast) {
      return {
          ok: false,
          error: `episode with podcast ID: ${podcastId} not found.`
      };
    }

    return {
        ok: true,
        episodes: episodesOfPodcast
    };
  }
  
  async createPodcast(createPodcastDto: CreatePodcastDto): Promise<CoreOutput> {
    const newPodcast = this.podcasts.create(createPodcastDto);
    
    for(let i=0; i<newPodcast.episodes.length; ++i) {
      const newEpisode = newPodcast.episodes[i];
      console.log(newEpisode);
      if(!(await this.episodes.save(newEpisode))) {
        return {
          ok: false,
          error: `Creation Error, New Episode of Potcast!`
        }
      }
    }

    if(!(await this.podcasts.save(newPodcast))) {
      return {
        ok: false,
        error: `Creation Error, New Podcast!`
      }
    }

    return { ok: true, error: null };
  }
  
  async createEpisode(podcastId: number, createEpisodeDto: CreateEpisodeDto): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({id: podcastId});
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${podcastId} not found.`
        }
    }

    const episodesOfPodcast = await this.episodes.find({podcast: podcast});
    console.log(`episode: ${episodesOfPodcast.length+1}`);
    if(!episodesOfPodcast) {
        return {
            ok: false,
            error: `Episode is undefined! [Potcast with ID: ${podcastId}]`
        }
    }

    episodesOfPodcast.push({
      id: episodesOfPodcast.length+1,
      ...createEpisodeDto
    })

    podcast.episodes = episodesOfPodcast;

    if(!(await this.episodes.save(podcast.episodes))) {
      return {
        ok: false,
        error: `New Episodes Creation Error.`
      }
    }

    if(!(await this.podcasts.save(podcast))) {
      return {
        ok: false,
        error: `New Podcast Creation Error.`
      }
    }

    return { ok: true, error: null };
  }

  async updatePodcast({id, data}: UpdatePotcastDto): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({id});
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${id} not found.`
        }
    }

    podcast.title = data.title !== undefined ? data.title : podcast.title;
    podcast.category = data.category !== undefined ? data.category : podcast.category;
    podcast.rating = data.rating !== undefined ? data.rating : podcast.rating;
    podcast.episodes = data.episodes !== undefined ? data.episodes : podcast.episodes;

    if(!(await this.podcasts.save(podcast))) {
      return {
        ok: false,
        error: `Podcast Update Error.`
      }
    }

    return { ok: true, error: null };
  }

  async updateEpisode({podcastId, episodeId, data}: UpdateEpisodeDto): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({id: podcastId});
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${podcastId} not found.`
        }
    }

    const episodeOfPodcast = await this.episodes.findOne({podcast: podcast, id:episodeId});
    if(!episodeOfPodcast) {
        return {
            ok: false,
            error: `Episode is undefined! [Potcast ID: ${podcastId}, Episode ID: ${episodeId}]`
        }
    }

    episodeOfPodcast.title = data.title !== undefined ? data.title : episodeOfPodcast.title;
    episodeOfPodcast.context = data.context !== undefined ? data.context : episodeOfPodcast.context;

    if(!(await this.episodes.save(episodeOfPodcast))) {
      return {
        ok: false,
        error: `Episode Update Error.`
      }
    }

    return { ok: true, error: null };
  }

  
  async deletePodcast(podcastId: number): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({id: podcastId});
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${podcastId} not found.`
        }
    }

    await this.podcasts.delete(podcastId);
    return { ok: true };
  }
  
  
  async deleteEpisode(podcastId: number, episodeId: number): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({id: podcastId});
    if(!podcast) {
        return {
            ok: false,
            error: `Potcast with ID: ${podcastId} not found.`
        }
    }

    const episodeOfPodcast = await this.episodes.findOne({podcast: podcast, id:episodeId});
    if(!episodeOfPodcast) {
        return {
            ok: false,
            error: `Episode is undefined! [Potcast ID: ${podcastId}, Episode ID: ${episodeId}]`
        }
    }

    await this.episodes.delete(episodeId);
    return { ok: true };
  }
  
}

