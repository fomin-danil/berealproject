import express from 'express'
import checkAuth from '../middlewares/checkAuth';
import { addComment, getCommentsForPost } from '../controllers/commentController';

const commentRouter = express.Router();

commentRouter.post('/', checkAuth(false), addComment);
commentRouter.get('/:postId', getCommentsForPost);

export default commentRouter;