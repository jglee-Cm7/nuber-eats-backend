import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Episode } from './episode.entity';

@ObjectType()
@Entity()
export class Podcast {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  category: string;

  @Column()
  @Field((type) => String)
  @IsString()
  description: string;

  @Column()
  @Field((type) => String)
  @IsString()
  coverImg: string;

  // TypeORM Default Value Setting
  @Column({ default: 0 })
  // GraphQL default Value Setting
  @Field((type) => Number, { defaultValue: 0 })
  // Validation : Number and Optional
  @IsNumber()
  @IsOptional()
  rating: number;

  @OneToMany(() => Episode, (episode) => episode.podcast)
  @Field((type) => [Episode], { defaultValue: [] })
  episodes: Episode[];
}
