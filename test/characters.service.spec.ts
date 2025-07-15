import {
    describe,
    it,
    expect,
    beforeEach,
    mock,
} from 'bun:test';
import { CharactersService } from '../src/star-wars/characters.service';
import { CharacterRepository } from '../src/star-wars/repositories/character.repository';
import {
    Mocked,
    mockObject,
} from './helpers/mockObjectFunctions';
import { plainToInstance } from 'class-transformer';

describe('CharactersService', () => {
    let charactersService: CharactersService;
    let characterRepository: Mocked<CharacterRepository>;

    beforeEach(() => {
        characterRepository = mockObject(
            plainToInstance(CharacterRepository, {}),
            mock,
        );

        charactersService = new CharactersService(
            characterRepository as any,
        );
    });

    describe('getCharacters', () => {
        it('returns characters with pagination', async () => {
            const mockRawData = [
                {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
                {
                    id: '2',
                    name: 'Darth Vader',
                    episodes: ['III', 'IV', 'V', 'VI'],
                },
            ];

            characterRepository.findWithPagination.mockResolvedValue(
                mockRawData,
            );
            characterRepository.count.mockResolvedValue(2);

            const result =
                await charactersService.getCharacters({
                    offset: 0,
                    limit: 10,
                });

            expect(result).toEqual({
                entries: mockRawData,
                count: 2,
            });

            expect(
                characterRepository.findWithPagination,
            ).toHaveBeenCalledWith(0, 10);
            expect(
                characterRepository.count,
            ).toHaveBeenCalled();
        });
    });
});
