import { Module } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CollectionsProvider } from './collections.provider';

@Module({
    providers: [
        {
            provide: 'FIRESTORE',
            useFactory: () => {
                return new Firestore({ preferRest: true });
            },
        },
        CollectionsProvider,
    ],
    exports: [CollectionsProvider],
})
export class CommonModule {}
