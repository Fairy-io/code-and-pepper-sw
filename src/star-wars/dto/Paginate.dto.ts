import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType({
    description:
        'Pagination parameters for retrieving paginated lists',
})
export class PaginateDto {
    @Field(() => Int, {
        description:
            'The page number to retrieve (starts from 1)',
    })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    page: number;

    @Field(() => Int, {
        description: 'Number of items per page (minimum 1)',
    })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    perPage: number;
}
