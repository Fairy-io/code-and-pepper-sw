import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    mock,
} from 'bun:test';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

import charactersQuery from './gql/characters.gql';
import charactersPaginationOnlyQuery from './gql/charactersPaginationOnly.gql';
import {
    Mocked,
    mockObject,
} from './helpers/mockObjectFunctions';
import { CharactersService } from '../src/star-wars/characters.service';

describe('characters query', () => {
    let app: INestApplication;
    let request: TestAgent;
    let charactersService: Mocked<CharactersService>;

    beforeAll(async () => {
        charactersService = mockObject(
            new CharactersService(),
            mock,
        );

        const appModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CharactersService)
            .useValue(charactersService)
            .compile();

        app = appModule.createNestApplication();
        await app.init();

        request = supertest(app.getHttpServer());
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        charactersService.getCharacters.mockReset();

        charactersService.getCharacters.mockResolvedValue({
            entries: [],
            count: 0,
        });
    });

    it('returns data and max pages', async () => {
        charactersService.getCharacters.mockResolvedValue({
            entries: [
                {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: [],
                },
                {
                    id: '2',
                    name: 'Darth Vader',
                    episodes: [],
                },
            ],
            count: 3,
        });

        const response = await request
            .post('/graphql')
            .send({
                query: charactersQuery,
                variables: { page: 1, perPage: 2 },
            });

        expect(response.body.data.characters).toEqual({
            entries: [
                {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: [],
                },
                {
                    id: '2',
                    name: 'Darth Vader',
                    episodes: [],
                },
            ],
            maxPages: 2,
        });
    });

    it('returns empty array if no characters are found', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: charactersQuery,
                variables: { page: 1, perPage: 10 },
            })
            .expect(200);

        expect(response.body.data.characters).toEqual({
            entries: [],
            maxPages: 0,
        });

        expect(
            charactersService.getCharacters,
        ).toHaveBeenCalledWith({
            offset: 0,
            limit: 10,
        });
    });

    it('returns empty array and correct max pages if requested page is greater than max pages', async () => {
        charactersService.getCharacters.mockResolvedValue({
            entries: [],
            count: 3,
        });

        const response = await request
            .post('/graphql')
            .send({
                query: charactersQuery,
                variables: { page: 3, perPage: 2 },
            })
            .expect(200);

        expect(response.body.data.characters).toEqual({
            entries: [],
            maxPages: 2,
        });
    });

    it('returns the same page and per page which passed in the query', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: charactersPaginationOnlyQuery,
                variables: { page: 2, perPage: 20 },
            })
            .expect(200);

        const { page, perPage, maxPages } =
            response.body.data.characters;

        expect(page).toBe(2);
        expect(perPage).toBe(20);
        expect(maxPages).toBe(0);

        expect(
            charactersService.getCharacters,
        ).toHaveBeenCalledWith({
            offset: 20,
            limit: 20,
        });
    });
});
