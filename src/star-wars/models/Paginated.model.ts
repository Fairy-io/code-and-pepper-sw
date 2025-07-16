import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function Paginated<T>(classRef: Type<T>) {
    @ObjectType(`${classRef.name}List`, {
        description: `Paginated list of ${classRef.name} items with pagination metadata`,
    })
    abstract class PaginatedType {
        @Field(() => [classRef], {
            description: `Array of ${classRef.name} items for the current page`,
        })
        entries: T[];

        @Field(() => Int, {
            description: 'Current page number',
        })
        page: number;

        @Field(() => Int, {
            description: 'Total number of pages available',
        })
        maxPages: number;

        @Field(() => Int, {
            description: 'Number of items per page',
        })
        perPage: number;
    }

    return PaginatedType;
}
