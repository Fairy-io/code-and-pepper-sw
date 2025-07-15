import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class PaginateDto {
    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    page: number;

    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    perPage: number;
}
