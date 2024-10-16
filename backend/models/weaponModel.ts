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

function validateDamageDice(value: any): boolean {
    if (!Array.isArray(value) || value.length !== 2) {
        return false;
    }
    const [diceType, quantity] = value;
    return Object.values(Dice).includes(diceType) && typeof quantity === 'number' && quantity > 0;
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
            validator: validateDamageDice,
            message: props => `${props.value} is not a valid damage dice array.`
        },
        required: true
    }
},
    {
        timestamps: true
    }
);

const Weapon = model<IWeapon>('Weapon', weaponSchema);
export { Weapon, IWeapon };