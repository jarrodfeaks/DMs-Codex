import { Schema, model, Document, ObjectId } from 'mongoose';
import { DamageType, Attribute, Dice } from '../../shared/enums';

interface IWeapon {
    name: string;
    hitModifier: number;
    baseDamage: number;
    damageType: DamageType;
    modification: Attribute;
    damageDice: [Dice, number];
}

const weaponSchema = new Schema<IWeapon>({
    name: { type: String, required: true },
    hitModifier: { type: Number, required: true, default: 0 },
    baseDamage: { type: Number, required: true, default: 1 },
    damageType: { type: String, enum: Object.values(DamageType), required: true },
    modification: { type: String, enum: Object.values(Attribute), required: true },
    damageDice: {
        type: [Schema.Types.Mixed],
        validate: {
            validator: function (value: any) {
                return Array.isArray(value) && value.length === 2 && typeof value[1] === 'string' && typeof value[0] === 'number';
            },
            message: 'damageDice must be an array with [dice, amount]'
        }
    },
},
    {
        timestamps: true
    }
);

const Weapon = model<IWeapon>('Weapon', weaponSchema);
export { Weapon, IWeapon };