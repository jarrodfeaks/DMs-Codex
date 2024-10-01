import { Schema } from 'mongoose';
import { Effect } from '../models/effectModel';


const CreateEffect = async () => {
    const newEffect = new Effect({});
    const savedEffect = await newEffect.save();
    return savedEffect._id;
};

const DeleteEffect = async (effectId: Schema.Types.ObjectId) => {
    try {
        const deletedEffect = await Effect.findByIdAndDelete(effectId);
        return deletedEffect;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export { CreateEffect, DeleteEffect };