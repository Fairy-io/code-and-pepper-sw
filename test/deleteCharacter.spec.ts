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
import deleteCharacterMutation from './gql/deleteCharacter.gql';

describe('deleteCharacter mutation', () => {
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
        charactersService.deleteCharacter.mockReset();
    });

    it('deletes a character', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: deleteCharacterMutation,
                variables: { id: '1' },
            })
            .expect(200);

        expect(response.body.data.deleteCharacter).toEqual({
            success: true,
        });

        expect(
            charactersService.deleteCharacter,
        ).toHaveBeenCalledWith('1');
    });

    it('returns an error if the id is not a string', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: deleteCharacterMutation,
                variables: { id: 1 },
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });

    it('returns an error if the id is not provided', async () => {
        const response = await request
            .post('/graphql')
            .send({
                query: deleteCharacterMutation,
            })
            .expect(200);

        expect(response.body.errors).toBeDefined();
    });
});
