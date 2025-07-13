export interface IdGeneratorServiceInterface {
    generateId(): string;
}

export const IdGeneratorServiceInterface = Symbol(
    'IdGeneratorServiceInterface',
);
