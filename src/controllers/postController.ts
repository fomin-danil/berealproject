import { Request, Response } from "express";
import Joi from 'joi'
import Post from "../models/Post";

const postSchema = Joi.object({
    authorId: Joi.string().required(),
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

export const createPost = async (req: Request, res: Response) => {
    try {
        const { error } = postSchema.validate(req.body)
        
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const { authorId, imageURL, caption, visibility } = req.body

        const post = new Post({
            authorId, imageURL, caption, visibility
        })

        await post.save();
        res.status(201).json({authorId})
    } catch (err) {
        console.log('err', err);
        
        res.status(500).json({ message: 'Server error' })
    }
}

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const requestingUserId = req.query.userId

        const posts = await Post.find()
        .populate('authorId', 'username profilePicture friendsList')
        .populate('comments')

        const filteredPosts = posts.filter((post) => {
            const author = post.authorId as any
            if (post.visibility === 'public') return true;
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

export const getPostById = async (req: Request, res: Response) => {
    try {
        const requestingUserId = req.query.userId
        const post = await Post.findById(req.params.id)
        .populate('authorId', 'username profilePicture friendsList')
        .populate('comments')

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (post.visibility === 'public') {
            return res.status(200).json(post)
        } else if (post.visibility === 'friends') {
            const author = post.authorId as any;
            if (author.friendsList.includes(requestingUserId)) {
                return res.status(200).json(post)
            } else {
                return res.status(403).json({ message: 'You dont have permission to view this post' })
            }
        } else if (post.visibility === 'private') {
            return res.status(403).json({ message: 'This post is private' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { error } = updatePostSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ messsage: error.details[0].message })
        }

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const userId = req.body?.userId

        if (post.authorId.toString() !== userId) {
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

export const deletePost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const userId = req.body?.userId

        if (post.authorId.toString() !== userId) {
            return res.status(403).json({ message: 'User is unauthorized to edit this post'})
        }

        await post.deleteOne()
        res.status(200).json({ message: 'Post deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const likePost =  async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const userId = req.body?.userId 
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'Post already liked'})
        }

        post.likes.push(userId)
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const unlikePost =  async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const userId = req.body?.userId 
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'Post not liked'})
        }

        post.likes = post.likes.filter((id) => id.toString() !== userId)
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}