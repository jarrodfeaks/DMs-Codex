import { Schema, model } from 'mongoose';
import { ICharacter, characterSchema } from './characterModel';
import { Class, Race } from '../enums';

interface IPlayer extends ICharacter {
    experience: number;
    armorClass: number;
    race: Race;
    class: Class;
    equipment: Map<string, number>;
    successfulSaveingThrows: number;
    failedSavingThrows: number;
    level: number;
}

const playerSchema = new Schema<IPlayer>(
    {
        experience: { type: Number, required: true, default: 0 },
        armorClass: { type: Number, required: true, default: 1 },
        race: { type: String, enum: Object.values(Race), required: true },
        class: { type: String, enum: Object.values(Class), required: true },
        equipment: { type: Map, of: Number, required: true },
        successfulSaveingThrows: { type: Number, required: true, default: 0 },
        failedSavingThrows: { type: Number, required: true, default: 0 },
        level: { type: Number, required: true, default: 1 },
    },
    {
        timestamps: true
    }
);

playerSchema.add(characterSchema.obj);

const Player = model('Player', playerSchema);

export { IPlayer, Player };