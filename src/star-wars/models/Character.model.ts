import {
    createUnionType,
    Field,
    ObjectType,
} from '@nestjs/graphql';
import { Paginated } from './Paginated.model';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class Character {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    id: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => [String])
    @IsString({ each: true })
    @IsNotEmpty()
    episodes: string[];
}

@ObjectType()
export class CharactersList extends Paginated(Character) {}

@ObjectType()
export class CharacterAlreadyExistsError {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    code: string;
}

export const CharactersListResponse = createUnionType({
    name: 'CharactersListResponse',
    types: () => [CharactersList],
});

export const CharacterResponse = createUnionType({
    name: 'CharacterResponse',
    types: () => [Character, CharacterAlreadyExistsError],
});
