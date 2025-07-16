import { Args, Query, Resolver } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import {
    Character,
    CharacterNotFoundError,
    CharacterResponse,
} from './models/Character.model';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CharacterResolver {
    constructor(
        private readonly charactersService: CharactersService,
    ) {}

    @Query(() => CharacterResponse)
    async character(
        @Args('id') id: string,
    ): Promise<Character | CharacterNotFoundError> {
        const character =
            await this.charactersService.getCharacterById(
                id,
            );

        if (!character) {
            return plainToInstance(CharacterNotFoundError, {
                code: 'CHARACTER_NOT_FOUND',
            });
        }

        return plainToInstance(Character, character);
    }
}
