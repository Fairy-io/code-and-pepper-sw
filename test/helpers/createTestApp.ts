import { Test } from '@nestjs/testing';
import {
    AppModule,
    configModule,
} from '../../src/app.module';
import { CharactersService } from '../../src/star-wars/characters.service';
import { ConfigModule } from '@nestjs/config';
import { createConfiguration } from '../../src/config';
import { Mocked } from './mockObject';
import { ValidationPipe } from '@nestjs/common';

export const createTestAppModule = async (
    charactersService: Mocked<CharactersService>,
) => {
    const testConfiguration = createConfiguration({
        app: { port: '3001' },
        service: {
            name: 'test',
            version: '1.0.0',
            description: 'test',
            env: 'test',
        },
    });

    const appModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(CharactersService)
        .useValue(charactersService)
        .overrideProvider('FIRESTORE')
        .useValue(null) // in test we should not use firestore
        .overrideModule(configModule)
        .useModule(
            ConfigModule.forRoot({
                isGlobal: true,
                load: [testConfiguration],
            }),
        )
        .compile();

    const app = appModule.createNestApplication();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        }),
    );
    await app.init();

    return app;
};
