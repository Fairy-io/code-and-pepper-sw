import { Observable } from 'rxjs';
import { PostModel } from '../models/response/Post.model';
import { PostDto } from '../models/dto/Post.dto';

export interface PostsServiceInterface {
    fetchAllPosts(): Observable<PostModel[]>;

    getPostById(id: string): Observable<PostModel | null>;

    createPost(data: PostDto): Observable<PostModel>;
    updatePost(
        id: string,
        data: PostDto,
    ): Observable<PostModel | null>;

    deletePost(id: string): void;
}

export const PostsServiceInterface = Symbol(
    'PostServiceInterface',
);
