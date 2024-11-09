import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongoose";

export interface AuthRequest extends Request {
    userId?: string | ObjectId;
}

const checkAuth = (optional: Boolean)  => (req: AuthRequest, res: Response, next: NextFunction) => {   
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    
    if (optional === true && !token) {
        return next();
    } else {
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'passkey') as { _id: string };
                req.userId = decoded._id;
                next();
            } catch (error) {
                return res.status(403).json({ message: 'Invalid token. Access denied' })
            }
        } else if (optional) {
            next();
        } else {
            return res.status(403).json({ message: 'No token provieded. Access denied' })
        }
    }
}

export default checkAuth;