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

        const countDoc = await collection.count().get();

        const { count } = countDoc.data();

        return count;
    }

    async create(characterData: any): Promise<any> {
        const collection =
            this.collections.getCharactersCollection();

        const docRef = await collection.add({
            ...characterData,
        });

        return {
            id: docRef.id,
            ...characterData,
        };
    }

    async countByName(name: string): Promise<number> {
        const collection =
            this.collections.getCharactersCollection();

        const countDoc = await collection
            .where('name', '==', name)
            .count()
            .get();

        const { count } = countDoc.data();

        return count;
    }

    async findById(id: string): Promise<any> {
        const collection =
            this.collections.getCharactersCollection();

        const doc = await collection.doc(id).get();

        if (!doc.exists) {
            return null;
        }

        return { id, ...doc.data() };
    }

    async delete(id: string): Promise<void> {
        const collection =
            this.collections.getCharactersCollection();

        await collection.doc(id).delete();
    }

    async update(
        id: string,
        characterData: any,
    ): Promise<any> {
        const collection =
            this.collections.getCharactersCollection();

        await collection
            .doc(id)
            .update({ ...characterData });

        return { id, ...characterData };
    }
}
