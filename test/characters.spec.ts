import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
} from 'bun:test';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

import charactersQuery from './gql/characters.gql';
import charactersPaginationOnlyQuery from './gql/charactersPaginationOnly.gql';

describe('characters query', () => {
    let app: INestApplication;
    let request: TestAgent;

    beforeAll(async () => {
        const appModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = appModule.createNestApplication();
        await app.init();

        request = supertest(app.getHttpServer());
    });

    afterAll(async () => {
        await app.close();
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
            page: 1,
            perPage: 10,
            maxPages: 1,
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

        const { page, perPage } =
            response.body.data.characters;

        expect(page).toBe(2);
        expect(perPage).toBe(20);
    });
});
