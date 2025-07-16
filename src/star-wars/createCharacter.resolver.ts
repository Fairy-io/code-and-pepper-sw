import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import {
    CharacterAlreadyExistsError,
    CharacterResponse,
} from './models/Character.model';
import { Character } from './models/Character.model';
import { CharacterDto } from './dto/Character.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CreateCharacterResolver {
    constructor(
        private readonly charactersService: CharactersService,
    ) {}

    @Mutation(() => CharacterResponse)
    async createCharacter(
        @Args('character') character: CharacterDto,
    ): Promise<Character | CharacterAlreadyExistsError> {
        try {
            const createdCharacter =
                await this.charactersService.createCharacter(
                    character,
                );

            return plainToInstance(
                Character,
                createdCharacter,
            );
        } catch (error) {
            if (
                !(error instanceof Error) ||
                error.name !== 'CHARACTER_ALREADY_EXISTS'
            ) {
                throw error;
            }

            return plainToInstance(
                CharacterAlreadyExistsError,
                {
                    code: error.name,
                },
            );
        }
    }
}
