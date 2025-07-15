import { Module } from '@nestjs/common';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [CharactersResolver, CharactersService],
})
export class StarWarsModule {}
