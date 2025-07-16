import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const validateObject = async <T extends object>(
    obj: Record<string, any>,
    schema: new () => T,
): Promise<T> => {
    const instance = plainToInstance(schema, obj);
    await validateOrReject(instance);
    return instance;
};
