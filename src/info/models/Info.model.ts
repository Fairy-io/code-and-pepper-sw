import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
    description:
        'Information about the Star Wars API service including name, version, description, and environment',
})
export class Info {
    @Field(() => String, {
        description: 'Human-readable name of the service',
    })
    name: string;

    @Field(() => String, {
        description:
            'Version of the service (formatted as "ver. X.X.X")',
    })
    version: string;

    @Field(() => String, {
        description:
            'Description of the service and its purpose',
    })
    description: string;

    @Field(() => String, {
        description:
            'Environment where the service is running (e.g., development, staging, production)',
    })
    env: string;
}
