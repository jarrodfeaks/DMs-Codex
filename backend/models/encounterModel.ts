import { Schema, model, ObjectId } from 'mongoose';

interface IEncounter {
    campaign_id: ObjectId;
    name: string;
    players: ObjectId[];
    monsters: ObjectId[];
    initiative_order: { entity_id: ObjectId; initiative_score: number }[];
    combat_log: string;
}

const encounterSchema = new Schema<IEncounter>({
    campaign_id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    monsters: [{ type: Schema.Types.ObjectId, ref: 'Monster' }],
    initiative_order: [
        {
            entity_id: { type: Schema.Types.ObjectId, required: true },
            initiative_score: { type: Number, required: true }
        }
    ]
    
},
    {
        timestamps: true
    }
);

const Encounter = model<IEncounter>('Character', encounterSchema);
export { Encounter, encounterSchema, IEncounter };