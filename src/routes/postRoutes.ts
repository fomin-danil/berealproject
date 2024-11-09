import express from 'express'
import { createPost, deletePost, getAllPosts, getPostById, likePost, unlikePost, updatePost } from '../controllers/postController';
import checkAuth from '../middlewares/checkAuth';

const postRouter = express.Router();

postRouter.post('/', checkAuth(false), createPost);
postRouter.get('/', checkAuth(true), getAllPosts);
postRouter.get('/:id', checkAuth(true), getPostById);
postRouter.put('/:id', checkAuth(false), updatePost);
postRouter.delete('/:id', checkAuth(false), deletePost);
postRouter.post('/:id/like', checkAuth(false), likePost);
postRouter.post('/:id/unlike', checkAuth(false), unlikePost);

export default postRouter;