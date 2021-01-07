import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@InputType('EpisodeInput')
@ObjectType('EpisodeType')
export class Episode {
    @Field(type => Number)
    @IsNumber()
    id: number;

    @Field(type => String)
    @IsString()
    title: string;

    @Field(type => String)
    @IsString()
    context: string;
}