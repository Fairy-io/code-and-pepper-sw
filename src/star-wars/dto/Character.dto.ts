import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CharacterDto {
    @Field(() => String)
    @IsNotEmpty()
    name: string;

    @Field(() => [String])
    @IsNotEmpty()
    episodes: string[];
}
