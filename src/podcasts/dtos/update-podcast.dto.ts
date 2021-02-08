import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

// @InputType()
// export class UpdatePodcastInputType extends PartialType(CreatePodcastDto) {}

// @InputType()
// export class UpdatePotcastDto {
//   @Field(type => Number)
//   @IsNumber()
//   id: number;

//   @Field(type => UpdatePodcastInputType)
//   data: UpdatePodcastInputType;
// }

@InputType()
export class UpdatePodcastPayload extends PartialType(
  PickType(Podcast, ['title', 'category', 'description', 'rating'], InputType),
) {}

@InputType()
export class UpdatePodcastInput extends PickType(Podcast, ['id'], InputType) {
  @Field((type) => UpdatePodcastPayload)
  payload: UpdatePodcastPayload;
}
