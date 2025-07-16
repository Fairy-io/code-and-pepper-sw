import { mock } from 'bun:test';
import { CharactersService } from '../../src/star-wars/characters.service';
import { plainToClass } from 'class-transformer';
import { mockObject } from './mockObject';

export const mockCharactersService = () => {
    const charactersService = mockObject(
        plainToClass(CharactersService, {}),
        mock,
    );

    return charactersService;
};
