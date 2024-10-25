import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
    _id: ObjectId;
    email: string;
    passwordHash: string;
    username: string;
    profilePicture?: string;
    friendsList: mongoose.Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true },
    profilePicture: { type: String },
    friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

export default mongoose.model<IUser>('User', UserSchema);
