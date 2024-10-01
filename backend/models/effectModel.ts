import { Schema, model, Document, ObjectId } from 'mongoose';
import { Attribute, DamageType, Skill, Status } from '../enums';

interface IEffect {
    status: Status[];
    temperaroaryModifiers: [Attribute | Skill, number][];
    damageImmunities: DamageType[];
    statusImmunities: Status[];
    resistances: DamageType[];
    vulnerabilities: DamageType[];
}

const effectSchema = new Schema<IEffect>({
    status: { type: [String], enum: Object.values(Status), required: true},
    temperaroaryModifiers: { type: [[String, Number]], required: false, default: [] },
    damageImmunities: { type: [String], enum: Object.values(DamageType), required: true, default: [] },
    statusImmunities: { type: [String], enum: Object.values(Status), required: true, default: [] },
    resistances: { type: [String], enum: Object.values(DamageType), required: true, default: [] },
    vulnerabilities: { type: [String], enum: Object.values(DamageType), required: true, default: [] },
},
    {
        timestamps: true
    }
);

const Effect = model<IEffect>('Effect', effectSchema);
export { Effect, IEffect };