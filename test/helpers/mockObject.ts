type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any
        ? K
        : never;
}[keyof T];

type PromiseOnly<T> =
    T extends Promise<infer U> ? U : never;

interface MockFunction<
    TArgs extends any[] = any,
    TResult = any,
> {
    (...args: TArgs): TResult;
    mockImplementation(
        fn: (...args: TArgs) => TResult,
    ): void;
    mockImplementationOnce(
        fn: (...args: TArgs) => TResult,
    ): void;
    mockReturnValue(value: TResult): void;
    mockReturnValueOnce(value: TResult): void;
    mockResolvedValue(value: PromiseOnly<TResult>): void;
    mockResolvedValueOnce(
        value: PromiseOnly<TResult>,
    ): void;
    mockRejectedValue(value: any): void;
    mockRejectedValueOnce(value: any): void;
    mockReset(): void;
    mockClear(): void;
    mockRestore(): void;
}

export type Mocked<T = Record<string, any>> = {
    [K in FunctionPropertyNames<T>]: T[K] extends (
        ...args: any[]
    ) => any
        ? MockFunction<Parameters<T[K]>, ReturnType<T[K]>>
        : never;
};

export function mockObject<T extends Record<string, any>>(
    obj: T,
    mockFn: () => MockFunction<any, any>,
): Mocked<T> {
    const properties = [
        ...Object.getOwnPropertyNames(
            Object.getPrototypeOf(obj),
        ),
        ...Object.keys(obj),
    ];

    properties.forEach((property) => {
        if (
            typeof obj[property] === 'function' &&
            ![
                'constructor',
                '__defineGetter__',
                '__defineSetter__',
                'hasOwnProperty',
                '__lookupGetter__',
                '__lookupSetter__',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toString',
                'valueOf',
                '__proto__',
                'toLocaleString',
            ].includes(property)
        ) {
            (obj as any)[property] = mockFn();
        }
    });

    return obj;
}
