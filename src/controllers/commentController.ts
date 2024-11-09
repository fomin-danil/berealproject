import { Response } from "express";
import Joi from 'joi'
import Comment from "../models/Comment";
import { AuthRequest } from "../middlewares/checkAuth";
import { ObjectId } from "mongoose";
import { commentValidation } from "../validations/comment";
import Post from "../models/Post";

export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const { error } = commentValidation(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const { postId, text } = req.body;
        const userId = req.userId;

        if (!userId) return res.status(403).json({ message: 'You dont have permission to edit this post'});

        const post = await Post.findById(postId);
        if (!post) return  res.status(404).json({ message: 'Post not found' });

        const newComment = new Comment({
            text,
            authorId: userId,
            postId
        })

        await newComment.save();

        post.comments.push(newComment._id as ObjectId);
        await post.save();

        return res.status(201).json(newComment)
    } catch (error) {                
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getCommentsForPost = async (req: AuthRequest, res: Response) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId })
        .populate('authorId', 'username profilePicture')
        .sort({ createdAt: -1 })

        return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json({ message: 'Server error' })
    }
}