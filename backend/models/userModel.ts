import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    dmId: string;
    rulebookId: string;
}

const userSchema = new Schema<IUser>({
    dmId: { type: String, required: true },
    rulebookId: { type: String },
}, {
    timestamps: true
});

const User = model<IUser>('User', userSchema);

export default User;