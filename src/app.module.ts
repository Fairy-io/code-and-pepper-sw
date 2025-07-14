import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { StarWarsModule } from './star-wars/starWars.module';
import { join } from 'path';

@Module({
    imports: [
        StarWarsModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            include: [StarWarsModule],
            autoSchemaFile: join(
                process.cwd(),
                'src/schema.gql',
            ),
            graphiql: true,
            playground: false,
            introspection: true,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
    ],
    providers: [],
})
export class AppModule {}
