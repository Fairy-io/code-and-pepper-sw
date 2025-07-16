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

    @Query(() => CharacterResponse, {
        description:
            'Retrieve a single Star Wars character by their unique ID',
    })
    async character(
        @Args('id', {
            description:
                'Unique identifier of the character to retrieve',
        })
        id: string,
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
