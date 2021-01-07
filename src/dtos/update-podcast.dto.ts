import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Episode } from '../entities/episode.entity';
import { PodcastSearchDto } from './podcast.dto';

@ArgsType()
export class UpdatePotcastDto extends PodcastSearchDto{
    @Field(type => String, {nullable: true})
    @IsString()
    @IsOptional()
    title?: string;

    @Field(type => String, {nullable: true})
    @IsString()
    @IsOptional()
    category?: string;

    @Field(type => Number, {nullable: true})
    @IsNumber()
    @IsOptional()
    rating?: number;

    @Field(type => [Episode], { nullable: true })
    @IsOptional()
    episodes?: Episode[];
}