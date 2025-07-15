import {
    plainToInstance,
    Transform,
    Type,
} from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    ValidateNested,
    validateOrReject,
} from 'class-validator';

export class AppConfig {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @Min(3000)
    @Max(65535)
    port: number;
}

export class ServiceConfig {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    version: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    env: string;
}

export class Config {
    @ValidateNested()
    @Type(() => AppConfig)
    @IsNotEmpty()
    app: AppConfig;

    @ValidateNested()
    @Type(() => ServiceConfig)
    @IsNotEmpty()
    service: ServiceConfig;
}

const errorToString = (error: any) => `${error}`;

export const createConfiguration =
    (obj: Record<string, any>) =>
    async (): Promise<Config> => {
        const config = plainToInstance(Config, obj);

        try {
            await validateOrReject(config);
        } catch (errors) {
            const configErrorMessages =
                errors.map(errorToString);

            console.log({ configErrorMessages });

            throw errors;
        }

        return config;
    };

export const configuration = createConfiguration({
    app: {
        port: process.env.PORT,
    },
    service: {
        name: process.env.SERVICE_NAME,
        version: process.env.SERVICE_VERSION,
        description: process.env.SERVICE_DESCRIPTION,
        env: process.env.SERVICE_ENV,
    },
});
