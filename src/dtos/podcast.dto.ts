import { ArgsType, Field } from "@nestjs/graphql";
import { IsNumber } from "class-validator";


@ArgsType()
export class PodcastSearchDto {
    @Field(type => Number)
    @IsNumber()
    id: number;
}

@ArgsType()
export class EpisodesSearchDto {
    @Field((type) => Number)
    @IsNumber()
    podcastId: number;

    @Field((type) => Number)
    @IsNumber()
    episodeId: number;
}