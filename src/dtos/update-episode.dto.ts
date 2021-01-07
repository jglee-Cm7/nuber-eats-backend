import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { EpisodesSearchDto } from "./podcast.dto";

@ArgsType()
export class UpdateEpisodeDto extends EpisodesSearchDto {
    @Field(type => String, {nullable: true})
    @IsString()
    @IsOptional()
    title?: string;

    @Field(type => String, {nullable: true})
    @IsString()
    @IsOptional()
    context?: string;
}