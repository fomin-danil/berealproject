import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Invalid email format').isEmail().notEmpty(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }).notEmpty(),
    body('username', 'Username is required').notEmpty(),
]

export const loginValidation = [
    body('email', 'Invalid email format').isEmail().notEmpty(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }).notEmpty(),
]