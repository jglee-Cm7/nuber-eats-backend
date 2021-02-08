import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Episode } from './episode.entity';

@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  category: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  coverImg?: string;

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
