import { Injectable } from '@nestjs/common';
import { Character } from './models/Character.model';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CharacterRepository } from './repositories/character.repository';
import { CharacterDto } from './dto/Character.dto';

@Injectable()
export class CharactersService {
    constructor(
        private readonly characterRepository: CharacterRepository,
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
        const [rawDocs, totalCount] = await Promise.all([
            this.characterRepository.findWithPagination(
                offset,
                limit,
            ),
            this.characterRepository.count(),
        ]);

        const entries = await Promise.all(
            rawDocs.map(async (doc) => {
                const character = plainToInstance(
                    Character,
                    doc,
                );
                await validateOrReject(character);
                return character;
            }),
        );

        return {
            entries,
            count: totalCount,
        };
    }

    async createCharacter(
        characterData: CharacterDto,
    ): Promise<Character> {
        const count =
            await this.characterRepository.countByName(
                characterData.name,
            );

        if (count > 0) {
            const error = new Error();
            error.name = 'CHARACTER_ALREADY_EXISTS';
            throw error;
        }

        const result =
            await this.characterRepository.create(
                characterData,
            );

        const character = plainToInstance(
            Character,
            result,
        );

        await validateOrReject(character);

        return character;
    }

    async getCharacterById(
        id: string,
    ): Promise<Character | null> {
        const result =
            await this.characterRepository.findById(id);

        if (!result) {
            return null;
        }

        const character = plainToInstance(
            Character,
            result,
        );

        await validateOrReject(character);

        return character;
    }

    async updateCharacter(
        id: string,
        characterData: CharacterDto,
    ): Promise<Character> {
        const existingCharacter =
            await this.getCharacterById(id);

        if (!existingCharacter) {
            const error = new Error();
            error.name = 'CHARACTER_NOT_FOUND';
            throw error;
        }

        const count =
            await this.characterRepository.countByName(
                characterData.name,
            );

        const nameBelongsToTheSameCharacter =
            count === 1 &&
            existingCharacter.name === characterData.name;

        if (count > 0 && !nameBelongsToTheSameCharacter) {
            const error = new Error();
            error.name = 'CHARACTER_ALREADY_EXISTS';
            throw error;
        }

        const result =
            await this.characterRepository.update(
                id,
                characterData,
            );

        const character = plainToInstance(
            Character,
            result,
        );

        await validateOrReject(character);

        return character;
    }

    async deleteCharacter(id: string): Promise<void> {
        await this.characterRepository.delete(id);
    }
}
