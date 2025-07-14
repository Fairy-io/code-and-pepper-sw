import { Args, Query, Resolver } from '@nestjs/graphql';
import { CharactersList } from './models/Character.model';
import { PaginateDto } from './dto/Paginate.dto';

@Resolver()
export class CharactersResolver {
    @Query(() => CharactersList)
    async characters(
        @Args('paginate') paginate: PaginateDto,
    ): Promise<CharactersList> {
        const { page, perPage } = paginate;

        return {
            entries: [],
            page,
            perPage,
            maxPages: 1,
        };
    }
}
