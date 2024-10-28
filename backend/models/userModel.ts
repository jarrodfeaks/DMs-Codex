import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    dmId: string;
    rulebookId?: string;
    assistantId?: string;
    threadId?: string;
}

const userSchema = new Schema<IUser>({
    dmId: { type: String, required: true },
    rulebookId: { type: String, default: null },
    assistantId: { type: String, default: null },
    threadId: { type: String, default: null },
}, {
    timestamps: true
});

const User = model<IUser>('User', userSchema);

export default User;