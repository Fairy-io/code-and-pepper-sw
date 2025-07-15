import { Injectable } from '@nestjs/common';
import { CharactersList } from './models/Character.model';

@Injectable()
export class CharactersService {
    async getCharacters(
        page: number,
        perPage: number,
    ): Promise<Omit<CharactersList, 'page' | 'perPage'>> {
        throw new Error('Not implemented');
    }
}
