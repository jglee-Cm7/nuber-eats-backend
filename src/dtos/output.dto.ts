import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Episode } from "../entities/episode.entity";
import { Podcast } from "../entities/podcast.entity";

@ObjectType()
export class CoreOutput {
    @Field(type => Boolean)
    @IsBoolean()
    ok: boolean;

    @Field(type => String, {nullable: true})
    @IsString()
    @IsOptional()
    error?: string;
}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field(type => Podcast, { nullable: true })
  podcast?: Podcast;
}

@ObjectType()
export class EpisodesOutput extends CoreOutput {
  @Field(type => [Episode], { nullable: true })
  episodes?: Episode[];
}