import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@ObjectType({
    description:
        "Generic response type for operations that don't return specific data (e.g., delete operations)",
})
export class Void {
    @Field(() => Boolean, {
        description:
            'Indicates whether the operation was successful',
    })
    @IsBoolean()
    @IsNotEmpty()
    success: boolean;
}
