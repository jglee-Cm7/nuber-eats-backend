import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInput')
@ObjectType()
@Entity()
export class Episode extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  podcast: Podcast;
}
