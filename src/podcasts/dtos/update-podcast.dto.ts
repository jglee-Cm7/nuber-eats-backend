import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreatePodcastDto } from './create-podcast.dto';


@InputType()
export class UpdatePodcastInputType extends PartialType(CreatePodcastDto) {}

@InputType()
export class UpdatePotcastDto {
  @Field(type => Number)
  @IsNumber()
  id: number;

  @Field(type => UpdatePodcastInputType)
  data: UpdatePodcastInputType;
}