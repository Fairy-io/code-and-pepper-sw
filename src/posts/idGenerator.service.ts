import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IdGeneratorServiceInterface } from '../interfaces/IdGeneratorService.interface';

@Injectable()
export class IdGeneratorService
    implements IdGeneratorServiceInterface
{
    generateId(): string {
        return uuidv4();
    }
}
