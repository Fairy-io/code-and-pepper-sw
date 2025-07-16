import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@ObjectType()
export class Void {
    @Field(() => Boolean)
    @IsBoolean()
    @IsNotEmpty()
    success: boolean;
}
