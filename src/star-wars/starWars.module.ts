import { Module } from '@nestjs/common';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';
import { CommonModule } from '../common/common.module';
import { CharacterRepository } from './repositories/character.repository';
import { CreateCharacterResolver } from './createCharacter.resolver';

@Module({
    imports: [CommonModule],
    providers: [
        CharactersResolver,
        CreateCharacterResolver,
        CharactersService,
        CharacterRepository,
    ],
})
export class StarWarsModule {}
