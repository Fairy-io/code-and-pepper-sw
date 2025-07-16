import { INestApplication } from '@nestjs/common';
import { CharactersService } from '../src/star-wars/characters.service';
import { mockCharactersService } from './helpers/mockCharactersService';
import { createTestAppModule } from './helpers/createTestApp';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { Mocked } from './helpers/mockObject';
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
} from 'bun:test';
import createCharacterMutation from './gql/createCharacter.gql';

describe('createCharacter mutation', () => {
    let app: INestApplication;
    let request: TestAgent;
    let charactersService: Mocked<CharactersService>;

    beforeAll(async () => {
        charactersService = mockCharactersService();

        app = await createTestAppModule(charactersService);

        request = supertest(app.getHttpServer());
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        charactersService.createCharacter.mockReset();

        charactersService.createCharacter.mockResolvedValue(
            {
                id: '1',
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            },
        );
    });

    it('creates a character', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.data.createCharacter).toEqual({
            id: '1',
            name: 'Luke Skywalker',
            episodes: ['IV', 'V', 'VI'],
        });

        expect(
            charactersService.createCharacter,
        ).toHaveBeenCalledWith({
            name: 'Luke Skywalker',
            episodes: ['IV', 'V', 'VI'],
        });
    });

    it('returns error if the character already exists', async () => {
        charactersService.createCharacter.mockImplementation(
            async () => {
                const error = new Error();
                error.name = 'CHARACTER_ALREADY_EXISTS';
                throw error;
            },
        );

        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.data.createCharacter).toEqual({
            code: 'CHARACTER_ALREADY_EXISTS',
        });
    });

    it('returns error if name is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns error if episodes is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    name: 'Luke Skywalker',
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns error if name is not a string', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    name: 123,
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns error if episodes is not an array', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    name: 'Luke Skywalker',
                    episodes: {},
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns error if episodes is not an array of strings', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: createCharacterMutation,
                variables: {
                    name: 'Luke Skywalker',
                    episodes: [1, 2, 3],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });
});
