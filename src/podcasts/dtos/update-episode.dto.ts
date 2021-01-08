import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CreateEpisodeDto } from "./create-episode.dto";

@InputType()
export class UpdateEpisodeInputType extends PartialType(CreateEpisodeDto) {}

@InputType()
export class UpdateEpisodeDto {
  @Field(type => Number)
  @IsNumber()
  podcastId: number;

  @Field(type => Number)
  @IsNumber()
  episodeId: number;

  @Field(type => UpdateEpisodeInputType)
  data: UpdateEpisodeInputType;
}