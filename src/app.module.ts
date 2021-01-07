import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsModule } from './podcasts/podcasts.module';

@Module({
  imports: [GraphQLModule.forRoot({
    autoSchemaFile: true,
  }),
  PodcastsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
