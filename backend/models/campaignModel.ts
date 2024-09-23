import { Schema, model, Document, ObjectId } from 'mongoose';

interface ICampaign {
    dm_id: ObjectId;
    name: string;
    description: string;
    encounters: ObjectId[];
    players: ObjectId[];
    monsters: ObjectId[];
}

const campaignSchema = new Schema<ICampaign>({
    dm_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    encounters: [{ type: Schema.Types.ObjectId, ref: 'Encounter' }],
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    monsters: [{ type: Schema.Types.ObjectId, ref: 'Monster' }]
},
    {
        timestamps: true
    }
);

const Campaign = model<ICampaign>('Character', campaignSchema);
export { Campaign, campaignSchema, ICampaign };