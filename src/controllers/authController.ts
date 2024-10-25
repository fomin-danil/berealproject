import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ email, passwordHash, username });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET || 'passkey', { expiresIn: '24h' });

        res.status(201).json({ token, userId: newUser._id, username: newUser.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
       
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'passkey', { expiresIn: '24h' });
        res.status(200).json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}