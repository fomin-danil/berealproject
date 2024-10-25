import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    userId?: string;
}

const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'passkey') as { _id: string };
            req.userId = decoded._id;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Invalid token. Access denied' })
        }
    } else {
        return res.status(403).json({ message: 'No token provieded. Access denied' })
    }
}

export default checkAuth;