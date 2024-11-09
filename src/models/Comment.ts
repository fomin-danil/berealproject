import mongoose, { Date, Document, Schema } from "mongoose";

export interface IComment extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    authorId: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const CommentSchema: Schema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IComment>('Comment', CommentSchema) 