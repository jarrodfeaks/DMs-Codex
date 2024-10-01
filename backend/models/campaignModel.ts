import { Schema, model, ObjectId } from 'mongoose';

interface ICampaign {
    dm_id: string;
    name: string;
    description: string;
    encounters: ObjectId[];
    players: ObjectId[];
    monsters: ObjectId[];
}

const campaignSchema = new Schema<ICampaign>({
    dm_id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
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