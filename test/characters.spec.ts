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
import { AppModule, configModule } from '../src/app.module';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { CharactersService } from '../src/star-wars/characters.service';
import { ConfigModule } from '@nestjs/config';
import charactersPaginationOnlyQuery from './gql/charactersPaginationOnly.gql';
import {
    Mocked,
    mockObject,
} from './helpers/mockObjectFunctions';
import { createConfiguration } from '../src/config';

import charactersQuery from './gql/characters.gql';
import { plainToClass } from 'class-transformer';

const testConfiguration = createConfiguration({
    app: { port: '3001' },
    service: {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        env: 'test',
    },
});

describe('characters query', () => {
    let app: INestApplication;
    let request: TestAgent;
    let charactersService: Mocked<CharactersService>;

    beforeAll(async () => {
        charactersService = mockObject(
            plainToClass(CharactersService, {}),
            mock,
        );

        const appModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CharactersService)
            .useValue(charactersService)
            .overrideProvider('FIRESTORE')
            .useValue(null) // in test we should not use firestore
            .overrideModule(configModule)
            .useModule(
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [testConfiguration],
                }),
            )
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
