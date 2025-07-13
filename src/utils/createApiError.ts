import { HttpException } from '@nestjs/common';
import { ErrorModel } from '../models/response/Error.model';

export const createApiError = (
    code: number,
    message: string,
) => {
    const errorModel: ErrorModel = {
        status: code,
        message,
        service: 'posts',
    };

    const apiError = new HttpException(errorModel, code);

    return apiError;
};
