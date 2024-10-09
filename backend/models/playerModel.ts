import { Schema, model } from 'mongoose';
import { ICharacter, characterSchema } from './characterModel';
import { Class, Race } from '../../shared/enums';
import { Effect } from './effectModel';

interface IPlayer extends ICharacter {
    level: number;    
    experience: number;
    armorClass: number;
    race: Race;
    class: Class;
    equipment: Map<string, number>;
    deathSavingThrows: boolean[];
}

const playerSchema = new Schema<IPlayer>(
    {
        level: { type: Number, required: true, default: 1 },
        experience: { type: Number, required: true, default: 0 },
        armorClass: { type: Number, required: true, default: 1 },
        race: { type: String, enum: Object.values(Race), required: true },
        class: { type: String, enum: Object.values(Class), required: true },
        equipment: { type: Map, of: Number, required: false, default: {} },
        deathSavingThrows: {type: [Boolean], required: true, default: []},
    },
    {
        timestamps: true
    }
);

playerSchema.add(characterSchema.obj);

const Player = model('Player', playerSchema);

export { IPlayer, Player };