import { Schema, model, ObjectId } from 'mongoose';

interface ITurn {
    unitTurn: ObjectId;
    action: string;
    weapon: ObjectId;
    custom: string;
    targetUnits: { unit: ObjectId; hit: boolean }[];
    hitDiceRoll: number;
    damageRoll: number;
    bonusAction: boolean;
    reaction: boolean;
}

const turnSchema = new Schema<ITurn>(
    {
        unitTurn: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
        action: { type: String, required: true },
        weapon: { type: Schema.Types.ObjectId, ref: 'Weapon' },
        custom: { type: String, default: '' },
        targetUnits: [
            {
                unit: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
                hit: { type: Boolean, required: true }
            }
        ],
        hitDiceRoll: { type: Number, required: true },
        damageRoll: { type: Number, required: true },
        bonusAction: { type: Boolean, default: false },
        reaction: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const Turn = model('Turn', turnSchema);

export { ITurn, Turn };