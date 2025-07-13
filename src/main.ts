import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Config } from './config';
import { AppExceptionFilter } from './AppExceptionFilter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        }),
    );

    app.useGlobalFilters(new AppExceptionFilter());

    const configService =
        app.get<ConfigService<Config>>(ConfigService);

    const { port } = configService.get('app', {
        infer: true,
    })!;

    await app.listen(port);
}
bootstrap();
