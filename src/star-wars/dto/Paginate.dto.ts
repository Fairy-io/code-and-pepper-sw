import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class PaginateDto {
    @Field(() => Int)
    @IsInt()
    @Min(1)
    page: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    perPage: number;
}
