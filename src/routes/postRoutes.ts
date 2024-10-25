import express from 'express'
import { createPost, deletePost, getAllPosts, getPostById, likePost, unlikePost, updatePost } from '../controllers/postController';
import checkAuth from '../middlewares/checkAuth';

const postRouter = express.Router();

postRouter.post('/', checkAuth, createPost);
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.put('/:id', checkAuth, updatePost);
postRouter.delete('/:id', checkAuth, deletePost);
postRouter.post('/:id/like', checkAuth, likePost);
postRouter.post('/:id/unlike', checkAuth, unlikePost);

export default postRouter;