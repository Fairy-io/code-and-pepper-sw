import { Observable } from 'rxjs';
import { PostModel } from '../models/response/Post.model';

export interface PostsApiServiceInterface {
    fetchAllPosts(pattern: string): Observable<PostModel[]>;

    getPostById(
        pattern: string,
        id: string,
    ): Observable<PostModel | null>;

    createPost(
        pattern: string,
        data: PostModel,
    ): Observable<PostModel>;

    updatePost(
        pattern: string,
        data: Omit<PostModel, 'created_at'>,
    ): Observable<PostModel | null>;

    deletePost(pattern: string, id: string): void;
}

export const PostsApiServiceInterface = Symbol(
    'PostApiServiceInterface',
);
