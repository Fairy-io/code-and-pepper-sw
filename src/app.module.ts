import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';

@Module({
    imports: [
        PostsModule,
        ConfigModule.forRoot({
            isGlobal: true,
              load: [configuration],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
