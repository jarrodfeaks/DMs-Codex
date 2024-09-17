import { Schema, model, Document, ObjectId } from 'mongoose';
import { DamageType, Attribute, Dice } from '../enums';

interface IWeapon {
    name: string;
    damage: number;
    damageType: DamageType;
    modification: Attribute;
    damageDice: Dice;
    notes: string;
}

const weaponSchema = new Schema<IWeapon>({
    name: { type: String, required: true },
    damage: { type: Number, required: true, default: 1 },
    damageType: { type: String, enum: Object.values(DamageType), required: true },
    modification: { type: String, enum: Object.values(Attribute), required: true },
    damageDice: { type: String, enum: Object.values(Dice), required: true },
    notes: { type: String, required: false, default: '' }
},
    {
        timestamps: true
    }
);

const Weapon = model<IWeapon>('Weapon', weaponSchema);
export { Weapon, IWeapon };