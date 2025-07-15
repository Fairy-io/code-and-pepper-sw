import {
    createUnionType,
    Field,
    ObjectType,
} from '@nestjs/graphql';
import { Paginated } from './Paginated.model';

@ObjectType()
export class Character {
    @Field(() => String)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => [String])
    episodes: string[];
}

@ObjectType()
export class CharactersList extends Paginated(Character) {}

export const CharactersListResponse = createUnionType({
    name: 'CharactersListResponse',
    types: () => [CharactersList],
});

export const CharacterResponse = createUnionType({
    name: 'CharacterResponse',
    types: () => [Character],
});
