import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

// @InputType()
// export class UpdateEpisodeInputType extends PartialType(CreateEpisodeDto) {}

// @InputType()
// export class UpdateEpisodeDto {
//   @Field(type => Number)
//   @IsNumber()
//   podcastId: number;

//   @Field(type => Number)
//   @IsNumber()
//   episodeId: number;

//   @Field(type => UpdateEpisodeInputType)
//   data: UpdateEpisodeInputType;
// }

@InputType()
export class EpisodesSearchInput {
  @Field((type) => Int)
  @IsInt()
  podcastId: number;

  @Field((type) => Int)
  @IsInt()
  episodeId: number;
}

@InputType()
export class UpdateEpisodeInput extends EpisodesSearchInput {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
