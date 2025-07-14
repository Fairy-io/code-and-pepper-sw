import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function Paginated<T>(classRef: Type<T>) {
    @ObjectType(`${classRef.name}List`)
    abstract class PaginatedType {
        @Field(() => [classRef])
        entries: T[];

        @Field(() => Int)
        page: number;

        @Field(() => Int)
        maxPages: number;

        @Field(() => Int)
        perPage: number;
    }

    return PaginatedType;
}
