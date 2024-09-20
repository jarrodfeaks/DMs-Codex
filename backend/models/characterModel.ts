import { Schema, model, Document, ObjectId } from 'mongoose';
import { Attribute, Skill } from '../enums';

interface ICharacter extends Document {
    name: string;
    maxHitpoints: number;
    currentHitpoints: number;
    tempHitpoints: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    armorClass: number;
    initative: number;
    numBonusActions: number;
    numReactions: number;
    effectId: ObjectId;
    weapons: ObjectId[];
    notes?: string;
    proficiencies: [Attribute | Skill];
    permanentModifiers: Map<Attribute | Skill, number>;
}

const characterSchema = new Schema<ICharacter>({
    name: { type: String, required: true },
    maxHitpoints: { type: Number, required: true, default: 1 },
    currentHitpoints: { type: Number, required: true, default: 1 },
    tempHitpoints: { type: Number, required: true, default: 1 },
    strength: { type: Number, required: true, default: 1 },
    dexterity: { type: Number, required: true, default: 1 },
    constitution: { type: Number, required: true, default: 1 },
    intelligence: { type: Number, required: true, default: 1 },
    wisdom: { type: Number, required: true, default: 1 },
    charisma: { type: Number, required: true, default: 1 },
    armorClass: { type: Number, required: true, default: 1 },
    initative: { type: Number, required: true, default: 1 },
    numBonusActions: { type: Number, required: true, default: 1 },
    numReactions: { type: Number, required: true, default: 1 },
    effectId: { type: Schema.Types.ObjectId, ref: 'Effect', required: false, default: null },
    weapons: [{ type: Schema.Types.ObjectId, ref: 'Weapon', required: false, default: [] }],
    notes: { type: String, required: false },
    permanentModifiers: { type: Map, of: Number, required: true, default: {} }
},
    {
        timestamps: true
    }
);

const Character = model<ICharacter>('Character', characterSchema);
export { Character, characterSchema, ICharacter };