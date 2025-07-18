import { Args, Query, Resolver } from '@nestjs/graphql';
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

    @Query(() => CharactersListResponse, {
        description:
            'Retrieve a paginated list of all Star Wars characters',
    })
    async characters(
        @Args('paginate', {
            type: () => PaginateDto,
            description:
                'Pagination parameters for the character list',
        })
        paginate: PaginateDto,
    ): Promise<CharactersList> {
        const { page, perPage } = paginate;

        const { entries, count } =
            await this.charactersService.getCharacters({
                offset: (page - 1) * perPage,
                limit: perPage,
            });

        const maxPages = Math.ceil(count / perPage);

        return plainToInstance(CharactersList, {
            entries,
            page,
            perPage,
            maxPages,
        } satisfies CharactersList);
    }
}
