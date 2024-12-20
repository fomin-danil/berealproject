import mongoose, { Date, Document, Schema } from "mongoose";

export interface IPost extends Document {
    authorId: mongoose.Schema.Types.ObjectId;
    imageURL: String;
    caption: String;
    likes: mongoose.Schema.Types.ObjectId[];
    comments: mongoose.Schema.Types.ObjectId[];
    visibility: 'public' | 'private' | 'friends';
    createdAt: Date;
}

const PostSchema: Schema = new Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageURL: { type: String, required: true },
    caption: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    visibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public'},
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IPost>('Post', PostSchema)