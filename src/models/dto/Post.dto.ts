import { ApiProperty } from '@nestjs/swagger';
import { PostState } from '../response/Post.model';
import {
    IsString,
    MaxLength,
    MinLength,
    IsEnum,
    IsOptional,
} from '@nestjs/class-validator';

export class PostDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title: string;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    content: string;

    @ApiProperty({ example: PostState.DRAFT })
    @IsString()
    @IsEnum(PostState, {
        message: 'state must be PUBLISHED or DRAFT',
    })
    @IsOptional()
    state?: PostState;
}
