import { Schema, model } from 'mongoose';
import { ICharacter, characterSchema } from './characterModel';
import { MonsterType, MovementType } from '../enums';

interface IMonster extends ICharacter {
    challengeRating: number;
    creatureType: MonsterType[];
    speed: number;
    movementType: MovementType[];
    proficiencyBonus: number;
}

const monsterSchema = new Schema<IMonster>({
    challengeRating: { type: Number, required: true },
    creatureType: { type: [String], enum: Object.values(MonsterType), required: true },
    speed: { type: Number, required: true },
    movementType: { type: [String], enum: Object.values(MovementType), default: [] },
    proficiencyBonus: { type: Number, required: true, default: 0}
});

monsterSchema.add(characterSchema);

const Monster = model<IMonster>('Monster', monsterSchema);

export { IMonster, Monster };

