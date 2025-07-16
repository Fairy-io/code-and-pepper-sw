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
import characterQuery from './gql/character.gql';

describe('character query', () => {
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
        charactersService.getCharacterById.mockReset();

        charactersService.getCharacterById.mockResolvedValue(
            {
                id: '1',
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            },
        );
    });

    it('returns a character', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: characterQuery,
                variables: { id: '1' },
            })
            .expect(200);

        expect(response.body.data.character).toEqual({
            id: '1',
            name: 'Luke Skywalker',
            episodes: ['IV', 'V', 'VI'],
        });

        expect(
            charactersService.getCharacterById,
        ).toHaveBeenCalledWith('1');
    });

    it('returns an error if the character is not found', async () => {
        charactersService.getCharacterById.mockResolvedValue(
            null,
        );

        const response = await request
            .post('/graphql')
            .send({
                query: characterQuery,
                variables: { id: '1' },
            })
            .expect(200);

        expect(response.body.data.character).toEqual({
            code: 'CHARACTER_NOT_FOUND',
        });

        expect(
            charactersService.getCharacterById,
        ).toHaveBeenCalledWith('1');
    });

    it('returns an error if the id is not a string', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: characterQuery,
                variables: { id: 1 },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if the id is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: characterQuery,
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });
});
