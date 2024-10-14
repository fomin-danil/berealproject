import express from 'express'
import { createPost, getAllPosts, getPostById, updatePost } from '../controllers/postController';

const router = express.Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);

export default router;