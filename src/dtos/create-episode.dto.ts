import { InputType, OmitType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';

@InputType()
export class CreateEpisodeDto extends OmitType(Episode, ['id'], InputType) {}