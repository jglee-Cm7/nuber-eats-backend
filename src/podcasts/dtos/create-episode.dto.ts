import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class CreateEpisodeInput extends PickType(
  Episode,
  ['title'],
  InputType,
) {
  @Field((type) => Int)
  @IsInt()
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
