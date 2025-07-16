import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
} from 'bun:test';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { CharactersService } from '../src/star-wars/characters.service';
import { Mocked } from './helpers/mockObject';
import { createTestAppModule } from './helpers/createTestApp';
import { mockCharactersService } from './helpers/mockCharactersService';
import updateCharacterMutation from './gql/updateCharacter.gql';

describe('updateCharacter mutation', () => {
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
        charactersService.updateCharacter.mockReset();

        charactersService.updateCharacter.mockResolvedValue(
            {
                id: '1',
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            },
        );
    });

    it('updates a character', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.data.updateCharacter).toEqual({
            id: '1',
            name: 'Luke Skywalker',
            episodes: ['IV', 'V', 'VI'],
        });

        expect(
            charactersService.updateCharacter,
        ).toHaveBeenCalledWith('1', {
            name: 'Luke Skywalker',
            episodes: ['IV', 'V', 'VI'],
        });
    });

    it('returns an error if character is not found', async () => {
        charactersService.updateCharacter.mockImplementation(
            async () => {
                const error = new Error();
                error.name = 'CHARACTER_NOT_FOUND';
                throw error;
            },
        );

        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.data.updateCharacter).toEqual({
            code: 'CHARACTER_NOT_FOUND',
        });
    });

    it('returns an error if character name is not unique', async () => {
        charactersService.updateCharacter.mockImplementation(
            async () => {
                const error = new Error();
                error.name = 'CHARACTER_ALREADY_EXISTS';
                throw error;
            },
        );

        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.data.updateCharacter).toEqual({
            code: 'CHARACTER_ALREADY_EXISTS',
        });
    });

    it('returns an error if id is not a string', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: 1,
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if id is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if name is not a string', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    name: 1,
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if name is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    episodes: ['IV', 'V', 'VI'],
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if episodes is not an array of strings', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: 1,
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if episodes is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: updateCharacterMutation,
                variables: {
                    id: '1',
                    name: 'Luke Skywalker',
                },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });
});
