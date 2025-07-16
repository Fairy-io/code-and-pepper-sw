import {
    createUnionType,
    Field,
    ObjectType,
} from '@nestjs/graphql';
import { Paginated } from './Paginated.model';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType({
    description:
        'A Star Wars character with their basic information and episode appearances',
})
export class Character {
    @Field(() => String, {
        description: 'Unique identifier for the character',
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    @Field(() => String, {
        description: 'The name of the character',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => [String], {
        description:
            'List of Star Wars episodes where this character appears',
    })
    @IsString({ each: true })
    @IsNotEmpty()
    episodes: string[];
}

@ObjectType({
    description:
        'Paginated list of Star Wars characters with pagination metadata',
})
export class CharactersList extends Paginated(Character) {}

@ObjectType({
    description:
        'Error returned when attempting to create a character that already exists',
})
export class CharacterAlreadyExistsError {
    @Field(() => String, {
        description:
            'Error code indicating the character already exists',
    })
    @IsString()
    @IsNotEmpty()
    code: string;
}

@ObjectType({
    description:
        'Error returned when a requested character is not found',
})
export class CharacterNotFoundError {
    @Field(() => String, {
        description:
            'Error code indicating the character was not found',
    })
    @IsString()
    @IsNotEmpty()
    code: string;
}

export const CharactersListResponse = createUnionType({
    name: 'CharactersListResponse',
    description:
        'Union type for characters list query responses containing either a list of characters or an error',
    types: () => [CharactersList],
});

export const CharacterResponse = createUnionType({
    name: 'CharacterResponse',
    description:
        'Union type for character query responses - can be a character or an error',
    types: () => [
        Character,
        CharacterAlreadyExistsError,
        CharacterNotFoundError,
    ],
});
