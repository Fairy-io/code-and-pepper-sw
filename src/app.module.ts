import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { StarWarsModule } from './star-wars/starWars.module';
import { join } from 'path';
import { InfoModule } from './info/info.module';

export const configModule = ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
});

@Module({
    imports: [
        StarWarsModule,
        InfoModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            include: [StarWarsModule, InfoModule],
            autoSchemaFile: join(
                process.cwd(),
                'src/schema.gql',
            ),
            graphiql: true,
            playground: false,
            introspection: true,
        }),
        configModule,
    ],
})
export class AppModule {}
