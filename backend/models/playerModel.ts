import { Schema, model, Document } from 'mongoose';
import { ICharacter, characterSchema } from './characterModel';

interface IPlayer extends ICharacter {
    level: number;
    experience: number;
    // race: object;
    // class: object;
    // armor: object[];
    // weapons: object[];
    // tools: object[];
    // languages: object[];
}

const playerSchema = new Schema<IPlayer>(
    {
        level: { 
            type: Number, 
            required: true, 
            default: 1 
        },
        experience: { 
            type: Number, 
            required: true, 
            default: 0 
        },
    }
);

playerSchema.add(characterSchema.obj);

const Player = model('Player', playerSchema);

export { IPlayer, Player };