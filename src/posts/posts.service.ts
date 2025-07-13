import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import {
    PostModel,
    PostState,
} from '../models/response/Post.model';
import { PostDto } from '../models/dto/Post.dto';
import { PostsServiceInterface } from '../interfaces/PostsService.interface';
import { PostsApiServiceInterface } from '../interfaces/PostsApiService.interface';
import { IdGeneratorServiceInterface } from '../interfaces/IdGeneratorService.interface';

@Injectable()
export class PostsService implements PostsServiceInterface {
    constructor(
        @Inject(PostsApiServiceInterface)
        private readonly postsApi: PostsApiServiceInterface,
        @Inject(IdGeneratorServiceInterface)
        private readonly idGenerator: IdGeneratorServiceInterface,
    ) {}

    fetchAllPosts(): Observable<PostModel[]> {
        return this.postsApi.fetchAllPosts('posts.fetch');
    }

    getPostById(id: string): Observable<PostModel | null> {
        return this.postsApi.getPostById('posts.get', id);
    }

    createPost(data: PostDto): Observable<PostModel> {
        return this.postsApi.createPost('posts.create', {
            id: this.idGenerator.generateId(),
            title: data.title,
            content: data.content,
            state: data.state || PostState.DRAFT,
            hash: this.createHash(data.title, data.content),
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    updatePost(
        id: string,
        data: PostDto,
    ): Observable<PostModel | null> {
        return this.postsApi.updatePost('posts.update', {
            id,
            title: data.title,
            content: data.content,
            state: data.state || PostState.DRAFT,
            hash: this.createHash(data.title, data.content),
            updated_at: new Date(),
        });
    }

    deletePost(id: string): void {
        this.postsApi.deletePost('posts.delete', id);
    }

    private createHash(
        title: string,
        content: string,
    ): string {
        return crypto
            .createHash('md5')
            .update(`${title}:${content}`)
            .digest('hex');
    }
}
