import { Schema, model, ObjectId } from 'mongoose';

interface ICampaign {
    dmId: string;
    name: string;
    description: string;
    encounters: ObjectId[];
    players: ObjectId[];
    monsters: ObjectId[];
    notes: string;
}

const campaignSchema = new Schema<ICampaign>({
    dmId: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    encounters: [{ type: Schema.Types.ObjectId, ref: 'Encounter' }],
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    monsters: [{ type: Schema.Types.ObjectId, ref: 'Monster' }],
    notes: { type: String, default: '' }
},
    {
        timestamps: true
    }
);

const Campaign = model<ICampaign>('Campaign', campaignSchema);
export { Campaign, campaignSchema, ICampaign };