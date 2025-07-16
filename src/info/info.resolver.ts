import { Query, Resolver } from '@nestjs/graphql';
import { Info } from './models/Info.model';
import { Config } from '../config';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class InfoResolver {
    constructor(
        private readonly configService: ConfigService<Config>,
    ) {}

    @Query(() => Info, {
        description:
            'Get information about the Star Wars API service including name, version, description, and environment',
    })
    info(): Info {
        const { name, description, version, env } =
            this.configService.get('service', {
                infer: true,
            })!;

        return {
            name: this.parseServiceName(name),
            description,
            version: this.parseServiceVersion(version),
            env,
        };
    }

    private parseServiceName(serviceName: string) {
        return serviceName
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    private parseServiceVersion(serviceVersion: string) {
        return `ver. ${serviceVersion}`;
    }
}
