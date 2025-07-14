import { Module } from '@nestjs/common';
import { CharactersResolver } from './characters.resolver';

@Module({ providers: [CharactersResolver] })
export class StarWarsModule {}
