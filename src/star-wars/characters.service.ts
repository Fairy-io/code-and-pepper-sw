import { Injectable } from '@nestjs/common';
import { Character } from './models/Character.model';

@Injectable()
export class CharactersService {
    async getCharacters({
        offset,
        limit,
    }: {
        offset: number;
        limit: number;
    }): Promise<{
        entries: Character[];
        count: number;
    }> {
        throw new Error('Not implemented');
    }
}
