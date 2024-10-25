import { body, param } from "express-validator";

export const updateUserValidation = [
    body('email', 'Invalid email format').isEmail().notEmpty(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }).notEmpty(),
    body('username', 'Username is required').notEmpty(),
]

export const friendValidation = [
    param('friendId').isMongoId().withMessage('Invalid user ID')
]