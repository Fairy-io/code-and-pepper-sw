import { Test, TestingModule } from '@nestjs/testing';
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';
import { PostsController } from './posts.controller';
import {
    PostModel,
    PostState,
} from '../models/response/Post.model';
import { PostsService } from '../../mocks/posts.service';
import { HttpStatus } from '@nestjs/common';
import { PostDto } from '../models/dto/Post.dto';
import { PostsServiceInterface } from '../interfaces/PostsService.interface';

const testScheduler = new TestScheduler(
    (actual, expected) => {
        expect(actual).toEqual(expected);
    },
);

describe('PostsController', () => {
    let controller: PostsController;
    let postsService: PostsService;

    beforeEach(async () => {
        const module: TestingModule =
            await Test.createTestingModule({
                controllers: [PostsController],
                providers: [
                    {
                        provide: PostsServiceInterface,
                        useClass: PostsService,
                    },
                ],
            }).compile();

        controller =
            module.get<PostsController>(PostsController);

        postsService = module.get<PostsService>(
            PostsServiceInterface,
        );
    });

    describe('fetchAllPosts', () => {
        it('returns empty array', () => {
            postsService.posts = [];

            testScheduler.run(({ expectObservable }) => {
                const response = controller.fetchAllPosts();

                expectObservable(response).toBe('(a|)', {
                    a: [],
                });

                expect(postsService.calls).toEqual([
                    { data: { name: 'fetchAllPosts' } },
                ]);
            });
        });

        it('returns array with posts', () => {
            const posts: PostModel[] = [
                {
                    id: '123',
                    title: 'My first post',
                    content: 'My post content',
                    state: PostState.DRAFT,
                    hash: 'hash',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: '123',
                    title: 'My second post',
                    content: 'My post content',
                    state: PostState.PUBLISHED,
                    hash: 'hash',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];

            postsService.posts = posts;

            testScheduler.run(({ expectObservable }) => {
                const response = controller.fetchAllPosts();

                expectObservable(response).toBe('(a|)', {
                    a: posts,
                });

                expect(postsService.calls).toEqual([
                    { data: { name: 'fetchAllPosts' } },
                ]);
            });
        });
    });

    describe('getPost', () => {
        it('returns post if present', () => {
            const post: PostModel = {
                id: '123',
                title: 'My first post',
                content: 'My post content',
                state: PostState.DRAFT,
                hash: 'hash',
                created_at: new Date(),
                updated_at: new Date(),
            };

            postsService.posts = [post];

            testScheduler.run(({ expectObservable }) => {
                const response = controller.getPost(
                    post.id,
                );

                expectObservable(response).toBe('(a|)', {
                    a: post,
                });

                expect(postsService.calls).toEqual([
                    {
                        data: {
                            name: 'getPostById',
                            id: post.id,
                        },
                    },
                ]);
            });
        });

        it('throws error if post is not found', () => {
            const post: PostModel = {
                id: '123',
                title: 'My first post',
                content: 'My post content',
                state: PostState.DRAFT,
                hash: 'hash',
                created_at: new Date(),
                updated_at: new Date(),
            };

            postsService.posts = [post];

            testScheduler.run(({ expectObservable }) => {
                const response = controller.getPost('456');

                expectObservable(response).toBe(
                    '#',
                    null,
                    expect.objectContaining({
                        response: expect.objectContaining({
                            status: HttpStatus.NOT_FOUND,
                            message: 'Post not found',
                            service: 'posts',
                        }),
                        status: HttpStatus.NOT_FOUND,
                    }),
                );

                expect(postsService.calls).toEqual([
                    {
                        data: {
                            name: 'getPostById',
                            id: '456',
                        },
                    },
                ]);
            });
        });
    });

    describe('createPost', () => {
        it('returns created post', () => {
            const post: PostModel = {
                id: '123',
                title: 'My first post',
                content: 'My post content',
                state: PostState.DRAFT,
                hash: 'hash',
                created_at: new Date(),
                updated_at: new Date(),
            };

            const postData: PostDto = {
                title: 'My first post',
                content: 'My post content',
                state: PostState.DRAFT,
            };

            testScheduler.run(({ expectObservable }) => {
                const response =
                    controller.createPost(postData);

                expectObservable(response).toBe('(a|)', {
                    a: post,
                });

                expect(postsService.calls).toEqual([
                    {
                        data: {
                            name: 'createPost',
                            data: postData,
                        },
                    },
                ]);
            });
        });
    });

    describe('updatePost', () => {
        it('returns updated post', () => {
            const post: PostModel = {
                id: '123',
                title: 'My first post',
                content: 'My post content',
                state: PostState.DRAFT,
                hash: 'hash',
                created_at: new Date(),
                updated_at: new Date(),
            };

            postsService.posts = [post];

            const postData: PostDto = {
                title: 'My first post updated',
                content: 'My post content updated',
                state: PostState.PUBLISHED,
            };

            testScheduler.run(({ expectObservable }) => {
                const response = controller.updatePost(
                    '123',
                    postData,
                );

                expectObservable(response).toBe('(a|)', {
                    a: {
                        ...post,
                        title: postData.title,
                        content: postData.content,
                        state: postData.state,
                    },
                });

                expect(postsService.calls).toEqual([
                    {
                        data: {
                            name: 'updatePost',
                            data: postData,
                            id: '123',
                        },
                    },
                ]);
            });
        });

        it('throws error if post is not found', () => {
            const postData: PostDto = {
                title: 'My first post updated',
                content: 'My post content updated',
                state: PostState.PUBLISHED,
            };

            testScheduler.run(({ expectObservable }) => {
                const response = controller.updatePost(
                    '123',
                    postData,
                );

                expectObservable(response).toBe(
                    '#',
                    null,
                    expect.objectContaining({
                        response: expect.objectContaining({
                            status: HttpStatus.NOT_FOUND,
                            message: 'Post not found',
                            service: 'posts',
                        }),
                        status: HttpStatus.NOT_FOUND,
                    }),
                );

                expect(postsService.calls).toEqual([
                    {
                        data: {
                            name: 'updatePost',
                            data: postData,
                            id: '123',
                        },
                    },
                ]);
            });
        });
    });

    describe('deletePost', () => {
        it('returns nothing', () => {
            const response = controller.deletePost('12345');

            expect(response).toBeUndefined();

            expect(postsService.calls).toEqual([
                {
                    data: {
                        name: 'deletePost',
                        id: '12345',
                    },
                },
            ]);
        });
    });
});
