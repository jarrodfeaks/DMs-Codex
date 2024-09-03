import { Schema, model } from 'mongoose';
import { Status } from '../enums';

interface ICharacter {
    name: string;
    hitpoints: number;
    armor: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    savingThrowsModifier: number;
    // vulnerabilities?: object;
    // resistances?: object;
    // immunities?: object;
    conditions?: Status;
    // createdAt?: Date;
}

const characterSchema = new Schema<ICharacter>({
    name: { type: String, required: true },
    hitpoints: { type: Number, required: true, default: 1 },
    armor: { type: Number, required: true, default: 1 },
    strength: { type: Number, required: true, default: 1 },
    dexterity: { type: Number, required: true, default: 1 },
    intelligence: { type: Number, required: true, default: 1 },
    charisma: { type: Number, required: true, default: 1 },
    savingThrowsModifier: { type: Number, required: true, default: 1 },
    // vulnerabilities: { type: Object, required: false },
    // resistances: { type: Object, required: false },
    // immunities: { type: Object, required: false },
    conditions: { type: Object, enum: Object.values(Status), required: false },
    // createdAt: { type: Date, default: Date.now }
});

export { ICharacter, characterSchema };