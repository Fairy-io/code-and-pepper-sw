import { Module } from '@nestjs/common';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';
import { CommonModule } from '../common/common.module';
import { CharacterRepository } from './repositories/character.repository';
import { CreateCharacterResolver } from './createCharacter.resolver';
import { CharacterResolver } from './character.resolver';
import { DeleteCharacterResolver } from './deleteCharacter.resolver';
import { UpdateCharacterResolver } from './updateCharacter.resolver';

@Module({
    imports: [CommonModule],
    providers: [
        CharactersResolver,
        CreateCharacterResolver,
        CharacterResolver,
        DeleteCharacterResolver,
        UpdateCharacterResolver,
        CharactersService,
        CharacterRepository,
    ],
})
export class StarWarsModule {}
