import { Module } from '@nestjs/common';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';
import { CommonModule } from '../common/common.module';
import { CharacterRepository } from './repositories/character.repository';

@Module({
    imports: [CommonModule],
    providers: [
        CharactersResolver,
        CharactersService,
        CharacterRepository,
    ],
})
export class StarWarsModule {}
