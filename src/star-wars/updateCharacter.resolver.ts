import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import {
    Character,
    CharacterAlreadyExistsError,
    CharacterNotFoundError,
    CharacterResponse,
} from './models/Character.model';
import { CharacterDto } from './dto/Character.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class UpdateCharacterResolver {
    constructor(
        private readonly charactersService: CharactersService,
    ) {}

    @Mutation(() => CharacterResponse)
    async updateCharacter(
        @Args('id') id: string,
        @Args('character') character: CharacterDto,
    ): Promise<Character | CharacterNotFoundError> {
        try {
            const updatedCharacter =
                await this.charactersService.updateCharacter(
                    id,
                    character,
                );

            return plainToInstance(
                Character,
                updatedCharacter,
            );
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }

            if (error.name === 'CHARACTER_NOT_FOUND') {
                return plainToInstance(
                    CharacterNotFoundError,
                    {
                        code: error.name,
                    },
                );
            }

            if (error.name === 'CHARACTER_ALREADY_EXISTS') {
                return plainToInstance(
                    CharacterAlreadyExistsError,
                    {
                        code: error.name,
                    },
                );
            }

            throw error;
        }
    }
}
