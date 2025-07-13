import { ApiProperty } from '@nestjs/swagger';

export enum PostState {
    PUBLISHED = 'PUBLISHED',
    DRAFT = 'DRAFT',
}

export class PostModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty({ example: PostState.DRAFT })
    state: PostState;

    @ApiProperty()
    hash: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}
