import { Schema, model } from 'mongoose';
import { ICharacter, characterSchema } from './characterSchema';

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

const playerSchema = new Schema<IPlayer>({
    level: { type: Number, required: true },
    experience: { type: Number, required: true },
    // race: { type: Object, required: true },
    // class: { type: Object, required: true },
    // armor: { type: Array, required: true },
    // weapons: { type: Array, required: true },
    // tools: { type: Array, required: true },
    // languages: { type: Array, required: true },
});
playerSchema.add(characterSchema);

const PlayerModel = model<IPlayer>('Player', playerSchema);

export { IPlayer, PlayerModel };