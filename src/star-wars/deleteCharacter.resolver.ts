import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Void } from './models/Void.model';
import { CharactersService } from './characters.service';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class DeleteCharacterResolver {
    constructor(
        private readonly charactersService: CharactersService,
    ) {}

    @Mutation(() => Void, {
        description:
            'Delete a Star Wars character by their unique ID',
    })
    async deleteCharacter(
        @Args('id', {
            description:
                'Unique identifier of the character to delete',
        })
        id: string,
    ): Promise<Void> {
        await this.charactersService.deleteCharacter(id);

        return plainToInstance(Void, {
            success: true,
        });
    }
}
