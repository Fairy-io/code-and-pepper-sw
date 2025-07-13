import { Test, TestingModule } from '@nestjs/testing';
import { TestScheduler } from 'rxjs/testing';
import { PostsService } from './posts.service';
import { PostsApiService } from '../../mocks/postsApi.service';
import { PostsApiServiceInterface } from '../interfaces/PostsApiService.interface';
import { PostState } from '../models/response/Post.model';
import { IdGeneratorServiceInterface } from '../interfaces/IdGeneratorService.interface';
import { IdGeneratorService } from '../../mocks/idGenerator.service';

const testScheduler = new TestScheduler(
    (actual, expected) => {
        expect(actual).toEqual(expected);
    },
);

describe('PostsService', () => {
    let service: PostsService;
    let postsApi: PostsApiService;

    beforeEach(async () => {
        const module: TestingModule =
            await Test.createTestingModule({
                providers: [
                    PostsService,
                    {
                        provide: PostsApiServiceInterface,
                        useClass: PostsApiService,
                    },
                    {
                        provide:
                            IdGeneratorServiceInterface,
                        useClass: IdGeneratorService,
                    },
                ],
            }).compile();

        service = module.get<PostsService>(PostsService);
        postsApi = module.get<PostsApiService>(
            PostsApiServiceInterface,
        );
    });

    describe('fetchAllPosts', () => {
        it('returns all posts', () => {
            testScheduler.run(({ expectObservable }) => {
                const response = service.fetchAllPosts();

                expectObservable(response).toBe('(a|)', {
                    a: [
                        expect.objectContaining({
                            id: '123',
                            title: 'Title',
                            content: 'Content',
                            state: PostState.DRAFT,
                            hash: 'hash',
                            created_at: expect.anything(),
                            updated_at: expect.anything(),
                        }),
                    ],
                });

                expect(postsApi.data).toEqual([
                    {
                        pattern: 'posts.fetch',
                        data: {},
                    },
                ]);
            });
        });
    });

    describe('getPostById', () => {
        it('returns post', () => {
            testScheduler.run(({ expectObservable }) => {
                const response = service.getPostById('123');

                expectObservable(response).toBe('(a|)', {
                    a: expect.objectContaining({
                        id: '123',
                        title: 'Title',
                        content: 'Content',
                        state: PostState.DRAFT,
                        hash: 'hash',
                        created_at: expect.anything(),
                        updated_at: expect.anything(),
                    }),
                });

                expect(postsApi.data).toEqual([
                    {
                        pattern: 'posts.get',
                        data: { id: '123' },
                    },
                ]);
            });
        });

        it('returns null if post is not found', () => {
            testScheduler.run(({ expectObservable }) => {
                const response = service.getPostById('1');

                expectObservable(response).toBe('(a|)', {
                    a: null,
                });

                expect(postsApi.data).toEqual([
                    {
                        pattern: 'posts.get',
                        data: { id: '1' },
                    },
                ]);
            });
        });
    });

    describe('createPost', () => {
        it('creates a post', () => {
            testScheduler.run(({ expectObservable }) => {
                const response = service.createPost({
                    title: 'My awesome title',
                    content: 'My awesome content',
                    state: PostState.DRAFT,
                });

                const expected = expect.objectContaining({
                    id: 'uuidv4',
                    title: 'My awesome title',
                    content: 'My awesome content',
                    state: PostState.DRAFT,
                    hash: '147c0613ffb82abd5cb5592fff06f058',
                    created_at: expect.anything(),
                    updated_at: expect.anything(),
                });

                expectObservable(response).toBe('(a|)', {
                    a: expected,
                });

                expect(postsApi.data).toEqual([
                    {
                        pattern: 'posts.create',
                        data: expected,
                    },
                ]);
            });
        });
    });

    describe('updatePost', () => {
        it('updates post', () => {
            testScheduler.run(({ expectObservable }) => {
                const response = service.updatePost(
                    'differentuuidv4',
                    {
                        title: 'Awesome title',
                        content: 'Awesome content',
                        state: PostState.PUBLISHED,
                    },
                );

                expectObservable(response).toBe('(a|)', {
                    a: expect.objectContaining({
                        id: 'differentuuidv4',
                        title: 'Awesome title',
                        content: 'Awesome content',
                        state: PostState.PUBLISHED,
                        hash: 'd4c73e95f29b6f4b73413da7abb0b762',
                        created_at: expect.anything(),
                        updated_at: expect.anything(),
                    }),
                });

                expect(postsApi.data).toEqual([
                    {
                        pattern: 'posts.update',
                        data: expect.objectContaining({
                            id: 'differentuuidv4',
                            title: 'Awesome title',
                            content: 'Awesome content',
                            state: PostState.PUBLISHED,
                            hash: 'd4c73e95f29b6f4b73413da7abb0b762',
                            updated_at: expect.anything(),
                        }),
                    },
                ]);
            });
        });

        it('returns null if post is not found', () => {
            testScheduler.run(({ expectObservable }) => {
                const response = service.updatePost(
                    'abcd-123',
                    {
                        title: 'Awesome title',
                        content: 'Awesome content',
                        state: PostState.PUBLISHED,
                    },
                );

                expectObservable(response).toBe('(a|)', {
                    a: null,
                });

                expect(postsApi.data).toEqual([
                    {
                        pattern: 'posts.update',
                        data: expect.objectContaining({
                            id: 'abcd-123',
                            title: 'Awesome title',
                            content: 'Awesome content',
                            state: PostState.PUBLISHED,
                            hash: 'd4c73e95f29b6f4b73413da7abb0b762',
                            updated_at: expect.anything(),
                        }),
                    },
                ]);
            });
        });
    });

    describe('deletePost', () => {
        it('deletes post', () => {
            const response = service.deletePost('12345');

            expect(response).toBeUndefined();

            expect(postsApi.data).toEqual([
                {
                    pattern: 'posts.delete',
                    data: { id: '12345' },
                },
            ]);
        });
    });
});
