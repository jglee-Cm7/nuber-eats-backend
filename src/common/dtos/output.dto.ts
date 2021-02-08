import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  error?: String;

  @Field((type) => Boolean)
  @IsBoolean()
  ok: boolean;
}
