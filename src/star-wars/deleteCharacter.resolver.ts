import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Void } from './models/Void.model';
import { CharactersService } from './characters.service';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class DeleteCharacterResolver {
    constructor(
        private readonly charactersService: CharactersService,
    ) {}

    @Mutation(() => Void)
    async deleteCharacter(
        @Args('id') id: string,
    ): Promise<Void> {
        await this.charactersService.deleteCharacter(id);

        return plainToInstance(Void, {
            success: true,
        });
    }
}
