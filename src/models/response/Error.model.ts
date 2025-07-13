import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorModel {
    @ApiProperty({
        example: HttpStatus.INTERNAL_SERVER_ERROR,
    })
    status: number;

    @ApiProperty()
    message: string;

    @ApiProperty({ example: 'posts' })
    service: 'posts';
}
