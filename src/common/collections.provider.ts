import { Firestore } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config';

@Injectable()
export class CollectionsProvider {
    private readonly collectionPrefix: string;

    constructor(
        @Inject('FIRESTORE')
        private readonly firestore: Firestore,
        private readonly config: ConfigService<Config>,
    ) {
        const { env, name } = this.config.get('service', {
            infer: true,
        })!;

        this.collectionPrefix = `${name}-${env}`;
    }

    getCharactersCollection() {
        return this.firestore.collection(
            `${this.collectionPrefix}-characters`,
        );
    }
}
