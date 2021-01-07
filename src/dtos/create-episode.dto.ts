import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PodcastSearchDto } from './podcast.dto';

@ArgsType()
export class CreateEpisodeDto extends PodcastSearchDto {
    @Field(type => String)
    @IsString()
    title: string;

    @Field(type => String)
    @IsString()
    context: string;
}