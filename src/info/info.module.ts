import { Module } from '@nestjs/common';
import { InfoResolver } from './info.resolver';

@Module({
    imports: [],
    providers: [InfoResolver],
    exports: [],
})
export class InfoModule {}
