import { Schema, model, ObjectId } from 'mongoose';
import { ICharacter } from './characterModel';
import { IWeapon } from './weaponModel';

interface ITurn {
    unitTurn: ObjectId;
    // unit turn
    // action
    // target
    // weapon
    // custom
    // diceRoll
    // hit
    // bonusAction
    // Reaction
    // note
}

const turnSchema = new Schema<ITurn>(
    {
        unitTurn: [{ type: Schema.Types.ObjectId, ref: 'Character', required: true }],
    },
    {
        timestamps: true
    }
);

const Turn = model('Turn', turnSchema);

export { ITurn, Turn };