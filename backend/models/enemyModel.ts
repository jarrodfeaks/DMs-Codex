import { Schema, model } from 'mongoose';
import { ICharacter, characterSchema } from './characterModel';
import { MonsterType, MovementType } from '../enums';

interface IEnemy extends ICharacter {
    challengeRating: number;
    creatureType: MonsterType[];
    speed: number;
    movementType: MovementType[];
    proficiencyBonus: number;
}

const enemySchema = new Schema<IEnemy>({
    challengeRating: { type: Number, required: true },
    creatureType: { type: [String], enum: Object.values(MonsterType), required: true },
    speed: { type: Number, required: true },
    movementType: { type: [String], enum: Object.values(MovementType), default: [] },
    proficiencyBonus: { type: Number, required: true, default: 0}
});

enemySchema.add(characterSchema);

const Enemy = model<IEnemy>('Enemy', enemySchema);

export { IEnemy, Enemy };

