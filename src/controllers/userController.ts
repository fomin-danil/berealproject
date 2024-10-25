import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middlewares/checkAuth";
import bcrypt from 'bcrypt';

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId; 
        const { email, username, password, profilePicture } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (email) {
            user.email = email;
        }
        if (username) {
            user.username = username;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(password, salt);
        }
        if (profilePicture) {
            user.profilePicture = profilePicture;
        }

        await user.save();

        res.status(200).json({ message: 'User updated', user: {
            email: user.email, username: user.username, profilePicture: user.profilePicture
        } })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const addFriend = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId; 
        const friendId = req.params.friendId;

        if (userId === friendId) {
            return res.status(400).json({ message: 'Cant add yourself'})
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User not found'})
        }

        if (user.friendsList.includes(friend._id)) {
            return res.status(400).json({ message: 'This user is already your friend' })
        }

        user.friendsList.push(friend._id);
        friend.friendsList.push(user._id);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend added' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const removeFriend = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId; 
        const friendId = req.params.friendId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User not found'})
        }

        if (!user.friendsList.includes(friend._id)) {
            return res.status(400).json({ message: 'This user is not your friend' })
        }

        user.friendsList = user.friendsList.filter((id) => id.toString() !== friendId)
        friend.friendsList = friend.friendsList.filter((id) => id.toString() !== userId)

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend removed' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}