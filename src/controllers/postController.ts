import { Response } from "express";
import Joi from 'joi'
import Post from "../models/Post";
import { AuthRequest } from "../middlewares/checkAuth";
import { ObjectId } from "mongoose";

const postSchema = Joi.object({
    // authorId: Joi.string().required(),
    imageURL: Joi.string().required(),
    caption: Joi.string().required(),
    visibility: Joi.string().valid('public', 'private').default('public')
})

const updatePostSchema = Joi.object({
    userId: Joi.string().optional(),
    imageURL: Joi.string().uri().optional(),
    caption: Joi.string().max(500).optional(),
    visibility: Joi.string().valid('public', 'private', 'friends').optional()
})

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { error } = postSchema.validate(req.body)
        
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const authorId = req.userId;
        const { imageURL, caption, visibility } = req.body

        const post = new Post({
            authorId, imageURL, caption, visibility
        })

        await post.save();
        res.status(201).json(post)
    } catch (err) {
        console.log('err', err);
        
        res.status(500).json({ message: 'Server error' })
    }
}

export const getAllPosts = async (req: AuthRequest, res: Response) => {    
    try {
        const requestingUserId = req.userId;
        const posts = await Post.find()
        .populate('authorId', 'username profilePicture friendsList')
        .populate('comments')

        const filteredPosts = posts.filter((post) => {
            const author = post.authorId as any
            if (post.visibility === 'public') return true;
            if (!requestingUserId) return false;
            if (post.visibility === 'private') {                
                return requestingUserId === String(author._id)
            }
            if (post.visibility === 'friends') {
                return author?.friendsList?.includes(requestingUserId) || requestingUserId === String(author._id)
            }
            return false;
        })

        res.status(200).json(filteredPosts)
    } catch (err) {
        console.log('err', err);
        
        res.status(500).json({ message: 'Server error' })
    }
}

export const getPostById = async (req: AuthRequest, res: Response) => {
    try {
        const requestingUserId = req.userId;

        const post = await Post.findById(req.params.id)
        .populate('authorId', 'username profilePicture friendsList')
        .populate('comments')

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (post.visibility === 'public') {
            return res.status(200).json(post)
        }

        if (!requestingUserId) return false; 

        if (post.visibility === 'friends') {
            const author = post.authorId as any;
            if (author.friendsList.includes(requestingUserId)) {
                return res.status(200).json(post)
            } else {
                return res.status(403).json({ message: 'You dont have permission to view this post' })
            }
        }
        
        if (post.visibility === 'private') {
            return res.status(403).json({ message: 'This post is private' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const requestingUserId = req.userId;

        const { error } = updatePostSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ messsage: error.details[0].message })
        }
        if (!requestingUserId) return res.status(403).json({ message: 'You dont have permission to edit this post'});

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (post.authorId.toString() !== requestingUserId) {
            return res.status(403).json({ message: 'User is unauthorized to edit this post'})
        }

        const { imageURL, caption, visibility } = req.body;
        if (imageURL) {
            post.imageURL = imageURL
        }
        if (caption) {
            post.caption = caption
        }
        if (visibility) {
            post.visibility = visibility
        }

        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const requestingUserId = req.userId;
        if (!requestingUserId) return res.status(403).json({ message: 'You dont have permission to edit this post'});

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (post.authorId.toString() !== requestingUserId) {
            return res.status(403).json({ message: 'User is unauthorized to edit this post'})
        }

        await post.deleteOne()
        res.status(200).json({ message: 'Post deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const likePost =  async (req: AuthRequest, res: Response) => {
    try {
        const requestingUserId = req.userId as ObjectId;
        if (!requestingUserId) return res.status(403).json({ message: 'You dont have permission to edit this post'});

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (post.likes.includes(requestingUserId)) {
            return res.status(400).json({ message: 'Post already liked'})
        }

        post.likes.push(requestingUserId)
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const unlikePost =  async (req: AuthRequest, res: Response) => {
    try {
        const requestingUserId = req.userId as ObjectId;
        const requestingUserIdStringified = String(requestingUserId);

        if (!requestingUserId) return res.status(403).json({ message: 'You dont have permission to edit this post'});

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (!post.likes.includes(requestingUserId)) {
            return res.status(400).json({ message: 'Post not liked'})
        }

        post.likes = post.likes.filter((id) => id.toString() !== requestingUserIdStringified)
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}