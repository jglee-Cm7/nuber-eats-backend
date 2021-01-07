import {ArgsType, Field} from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@ArgsType()
export class CreatePodcastDto {
    @Field(type => String)
    @IsString()
    title: string;

    @Field(type => String)
    @IsString()
    category: string;

    @Field(type => Number)
    @IsNumber()
    rating: number;
}