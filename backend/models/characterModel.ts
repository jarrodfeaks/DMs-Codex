import { Schema, model, Document, ObjectId } from 'mongoose';
import { Attribute, DamageType, Initative, Skill, Status } from '../../shared/enums';

interface SkillModifier {
  skill: string;
  is_proficient: boolean;
  modifier: number;
}

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
    customModifiers: Map<Skill | Initative, number>;
    status: Status[];
    temperaroaryModifiers: SkillModifier[];
    damageImmunities: DamageType[];
    statusImmunities: Status[];
    resistances: DamageType[];
    vulnerabilities: DamageType[];
    weapons: ObjectId[];
    proficiencies: [Attribute | Skill];
    notes: string;
}

const characterSchema = new Schema<ICharacter>({
    name: { type: String, required: true },
    maxHitpoints: { type: Number, required: true, default: 1 },
    currentHitpoints: { type: Number, required: true, default: 1 },
    tempHitpoints: { type: Number, required: false, default: 0 },
    strength: { type: Number, required: true, default: 1 },
    dexterity: { type: Number, required: true, default: 1 },
    constitution: { type: Number, required: true, default: 1 },
    intelligence: { type: Number, required: true, default: 1 },
    wisdom: { type: Number, required: true, default: 1 },
    charisma: { type: Number, required: true, default: 1 },
    armorClass: { type: Number, required: true, default: 1 },
    status: { type: [String], enum: Object.values(Status), required: false},
    temperaroaryModifiers: { type: [{skill: { type: String, required: true }, is_proficient: { type: Boolean, required: true }, modifier: { type: Number, required: true },},], required: false, default: [] },
    damageImmunities: { type: [String], enum: Object.values(DamageType), required: false, default: [] },
    statusImmunities: { type: [String], enum: Object.values(Status), required: false, default: [] },
    resistances: { type: [String], enum: Object.values(DamageType), required: false, default: [] },
    vulnerabilities: { type: [String], enum: Object.values(DamageType), required: true, default: [] },
    weapons: [{ type: Schema.Types.ObjectId, ref: 'Weapon', required: false, default: [] }],
    proficiencies: [{ type: [Schema.Types.Mixed], required: false, default: [] }],
    customModifiers: { type: Map, of: Number, required: false, default: {} },
    notes: { type: String, required: false },
},
    {
        timestamps: true
    }
);

const Character = model<ICharacter>('Character', characterSchema);
export { Character, characterSchema, ICharacter };