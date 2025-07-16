import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType({
    description:
        'Input data for creating or updating a Star Wars character',
})
export class CharacterDto {
    @Field(() => String, {
        description:
            'The name of the character (e.g., "Luke Skywalker", "Darth Vader")',
    })
    @IsNotEmpty()
    name: string;

    @Field(() => [String], {
        description:
            'List of Star Wars episodes where this character appears (e.g., ["A New Hope", "The Empire Strikes Back"])',
    })
    @IsNotEmpty()
    episodes: string[];
}
