import { Injectable } from '@nestjs/common';
import { CollectionsProvider } from '../../common/collections.provider';

@Injectable()
export class CharacterRepository {
    constructor(
        private readonly collections: CollectionsProvider,
    ) {}

    async findWithPagination(
        offset: number,
        limit: number,
    ): Promise<any[]> {
        const collection =
            this.collections.getCharactersCollection();
        const { docs } = await collection
            .limit(limit)
            .offset(offset)
            .get();

        return docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    async count(): Promise<number> {
        const collection =
            this.collections.getCharactersCollection();
        const { count } = (
            await collection.count().get()
        ).data();
        return count;
    }
}
