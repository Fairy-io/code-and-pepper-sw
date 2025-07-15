import { Injectable, Inject } from '@nestjs/common';
import { Character } from './models/Character.model';
import { Firestore } from '@google-cloud/firestore';
import { CollectionsProvider } from '../common/collections.provider';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class CharactersService {
    constructor(
        private readonly collections: CollectionsProvider,
    ) {}

    async getCharacters({
        offset,
        limit,
    }: {
        offset: number;
        limit: number;
    }): Promise<{
        entries: Character[];
        count: number;
    }> {
        const collection =
            this.collections.getCharactersCollection();

        const { docs } = await collection
            .limit(limit)
            .offset(offset)
            .get();

        const entries = await Promise.all(
            docs.map(async (doc) => {
                const data = doc.data();

                const character = plainToInstance(
                    Character,
                    { id: doc.id, ...data },
                );

                await validateOrReject(character);

                return character;
            }),
        );

        const { count } = (
            await collection.count().get()
        ).data();

        return {
            entries,
            count,
        };
    }
}
