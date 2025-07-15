import {
    Args,
    createUnionType,
    Query,
    Resolver,
} from '@nestjs/graphql';
import {
    CharactersList,
    CharactersListResponse,
} from './models/Character.model';
import { PaginateDto } from './dto/Paginate.dto';
import { CharactersService } from './characters.service';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CharactersResolver {
    constructor(
        private readonly charactersService: CharactersService,
    ) {}

    @Query(() => CharactersListResponse)
    async characters(
        @Args('paginate', { type: () => PaginateDto })
        paginate: PaginateDto,
    ): Promise<CharactersList> {
        const { page, perPage } = paginate;

        const characters =
            await this.charactersService.getCharacters(
                page,
                perPage,
            );

        return plainToInstance(CharactersList, {
            ...characters,
            page,
            perPage,
        });
    }
}
