import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ValidationError } from '@nestjs/class-validator';
import { Response } from 'express';
import { ErrorModel } from './models/response/Error.model';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();

        if (exception instanceof BadRequestException) {
            const res = exception.getResponse();

            const transformedError: ErrorModel = {
                status: HttpStatus.BAD_REQUEST,
                message:
                    typeof res === 'object' &&
                    'message' in res &&
                    Array.isArray(res.message)
                        ? res.message.join(', ')
                        : res.toString(),
                service: 'posts',
            };

            response
                .status(HttpStatus.BAD_REQUEST)
                .json(transformedError);

            return;
        }

        if (exception instanceof HttpException) {
            response
                .status(exception.getStatus())
                .json(exception.getResponse());

            return;
        }

        const transformedError: ErrorModel = {
            status:
                exception.code ||
                HttpStatus.INTERNAL_SERVER_ERROR,
            message:
                exception.message || 'Something went wrong',
            service: 'posts',
        };

        response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(transformedError);
    }
}
