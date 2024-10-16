import { Schema, model, ObjectId } from 'mongoose';

interface IEncounter {
    campaign_id: ObjectId;
    name: string;
    turns: ObjectId[];
    players: ObjectId[];
    monsters: ObjectId[];
    initiative_order: { entity_id: ObjectId; initiative_score: number }[];
    combat_log: string;
}

const encounterSchema = new Schema<IEncounter>({
    campaign_id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    turns: [{ type: Schema.Types.ObjectId, ref: 'Turn' }],
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    monsters: [{ type: Schema.Types.ObjectId, ref: 'Monster' }],
    initiative_order: [
        {
            entity_id: { type: Schema.Types.ObjectId, required: true },
            initiative_score: { type: Number, required: true }
        }
    ],
    combat_log: { type: String, required: false, default: '' }
},
    {
        timestamps: true
    }
);

const Encounter = model<IEncounter>('Encounter', encounterSchema);
export { Encounter, encounterSchema, IEncounter };