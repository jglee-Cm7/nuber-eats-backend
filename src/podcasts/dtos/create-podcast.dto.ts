import { InputType, OmitType} from '@nestjs/graphql';
import { Podcast } from 'src/podcasts/entities/podcast.entity';

@InputType()
export class CreatePodcastDto extends OmitType(Podcast, ['id'], InputType) {}