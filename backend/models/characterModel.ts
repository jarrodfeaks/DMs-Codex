import { Schema, model, Document } from 'mongoose';
import { Status } from '../enums';

interface ICharacter extends Document {
    name: string;
    hitpoints: number;
    armor: number;
    strength: number;
    constitution: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    wisdom: number;
    savingThrowsModifier: number;
    conditions?: Status;
}

const characterSchema = new Schema<ICharacter>({
    name: { type: String, required: true },
    hitpoints: { type: Number, required: true, default: 1 },
    armor: { type: Number, required: true, default: 1 },
    strength: { type: Number, required: true, default: 1 },
    constitution: { type: Number, required: true, default: 1 },
    dexterity: { type: Number, required: true, default: 1 },
    intelligence: { type: Number, required: true, default: 1 },
    charisma: { type: Number, required: true, default: 1 },
    wisdom: { type: Number, required: true, default: 1 },
    savingThrowsModifier: { type: Number, default: 0 },
    conditions: {
        type: String,
        enum: Object.values(Status),
        required: false
    },
},
    {
        timestamps: true
    }
);

const Character = model<ICharacter>('Character', characterSchema);
export { Character, characterSchema, ICharacter };