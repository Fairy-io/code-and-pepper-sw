import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';
import { PostsApiServiceInterface } from '../interfaces/PostsApiService.interface';
import { PostModel } from '../models/response/Post.model';

const emitEvent =
    (client: ClientProxy, pattern: string, data: any) =>
    (response: any) => {
        client.emit(pattern, {
            data,
            response,
            timestamp: new Date(),
        });
    };

/**
 * This service wraps ClientProxy for making NATS calls.
 * It also emits events as side effects.
 *
 * Note: Tests were omitted due to project constraints and the non-critical nature of emitted events.
 */
@Injectable()
export class PostsApiService
    implements PostsApiServiceInterface
{
    constructor(
        @Inject('posts-api-client')
        private readonly postsApi: ClientProxy,
    ) {}

    fetchAllPosts(
        pattern: string,
    ): Observable<PostModel[]> {
        return this.postsApi
            .send<PostModel[]>(pattern, {})
            .pipe(
                tap(
                    emitEvent(
                        this.postsApi,
                        'events.posts.fetched',
                        {},
                    ),
                ),
            );
    }

    getPostById(
        pattern: string,
        id: string,
    ): Observable<PostModel | null> {
        return this.postsApi
            .send<PostModel | null>(pattern, { id })
            .pipe(
                tap(
                    emitEvent(
                        this.postsApi,
                        'events.posts.retrieved_one',
                        { id },
                    ),
                ),
            );
    }

    createPost(
        pattern: string,
        data: PostModel,
    ): Observable<PostModel> {
        return this.postsApi
            .send<PostModel>(pattern, data)
            .pipe(
                tap(
                    emitEvent(
                        this.postsApi,
                        'events.posts.created',
                        data,
                    ),
                ),
            );
    }

    updatePost(
        pattern: string,
        data: Omit<PostModel, 'created_at'>,
    ): Observable<PostModel | null> {
        return this.postsApi
            .send<PostModel | null>(pattern, data)
            .pipe(
                tap(
                    emitEvent(
                        this.postsApi,
                        'events.posts.updated',
                        data,
                    ),
                ),
            );
    }

    deletePost(pattern: string, id: string): void {
        this.postsApi.emit(pattern, { id });
        emitEvent(this.postsApi, 'events.posts.deleted', {
            id,
        })({});
    }
}
