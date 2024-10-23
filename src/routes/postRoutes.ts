import express from 'express'
import { createPost, deletePost, getAllPosts, getPostById, likePost, unlikePost, updatePost } from '../controllers/postController';

const router = express.Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/unlike', unlikePost);

export default router;