import {
    describe,
    it,
    expect,
    beforeEach,
    mock,
} from 'bun:test';
import { CharactersService } from '../src/star-wars/characters.service';
import { CharacterRepository } from '../src/star-wars/repositories/character.repository';
import { Mocked, mockObject } from './helpers/mockObject';
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

        it('throws an error if one of the characters is invalid', async () => {
            const mockRawData = [
                {
                    id: '1',
                    name: 'Luke Skywalker',
                    episodes: ['IV', 'V', 'VI'],
                },
                {
                    id: '2',
                    name: 'Darth Vader',
                },
            ];

            characterRepository.findWithPagination.mockResolvedValue(
                mockRawData,
            );
            characterRepository.count.mockResolvedValue(2);

            expect(
                charactersService.getCharacters({
                    offset: 0,
                    limit: 10,
                }),
            ).rejects.toThrow();
        });
    });

    describe('createCharacter', () => {
        it('creates a character', async () => {
            const mockCharacter = {
                id: '1',
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            };

            const createCharacterData = {
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            };

            characterRepository.create.mockResolvedValue(
                mockCharacter,
            );

            characterRepository.countByName.mockResolvedValue(
                0,
            );

            const result =
                await charactersService.createCharacter(
                    createCharacterData,
                );

            expect(result).toEqual(mockCharacter);
            expect(
                characterRepository.create,
            ).toHaveBeenCalledWith(createCharacterData);
            expect(
                characterRepository.countByName,
            ).toHaveBeenCalledWith(
                createCharacterData.name,
            );
        });

        it('throws an error if the character is invalid', async () => {
            const mockCharacter = {
                id: '1',
                name: 'Luke Skywalker',
            };

            const createCharacterData = {
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            };

            characterRepository.create.mockResolvedValue(
                mockCharacter,
            );

            characterRepository.countByName.mockResolvedValue(
                0,
            );

            expect(
                charactersService.createCharacter(
                    createCharacterData,
                ),
            ).rejects.toThrow();
        });

        it('throws an error if the character already exists', async () => {
            expect.assertions(1);

            const createCharacterData = {
                name: 'Luke Skywalker',
                episodes: ['IV', 'V', 'VI'],
            };

            characterRepository.countByName.mockResolvedValue(
                1,
            );

            try {
                await charactersService.createCharacter(
                    createCharacterData,
                );
            } catch (error) {
                error instanceof Error &&
                    expect(error.name).toBe(
                        'CHARACTER_ALREADY_EXISTS',
                    );
            }
        });
    });
});
