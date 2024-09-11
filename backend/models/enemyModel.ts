import { Schema, model } from 'mongoose';
import { ICharacter, characterSchema } from './characterModel';

interface IEnemy extends ICharacter {
    difficulty: string;
    CR: number;
    // type: object[];
    // size: object[];
    // alignment: object[];
    // environment: object[];
    // tags?: object[];
}

const enemySchema = new Schema<IEnemy>({
    difficulty: { type: String, required: true },
    CR: { type: Number, required: true },
    /*
    type: { type: Array, required: true },
    size: { type: Array, required: true },
    alignment: { type: Array, required: true },
    environment: { type: Array, required: true },
    tags: { type: Array, required: true }
    */
});

enemySchema.add(characterSchema);

const EnemyModel = model<IEnemy>('Enemy', enemySchema);

export { IEnemy, EnemyModel };

