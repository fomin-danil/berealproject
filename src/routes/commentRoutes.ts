import express from 'express'
import checkAuth from '../middlewares/checkAuth';
import { addComment, deleteComment, getCommentsForPost, updateComment } from '../controllers/commentController';

const commentRouter = express.Router();

commentRouter.post('/', checkAuth(false), addComment);
commentRouter.get('/:postId', getCommentsForPost);
commentRouter.put('/:id', checkAuth(false), updateComment);
commentRouter.delete('/:id', checkAuth(false), deleteComment);

export default commentRouter;