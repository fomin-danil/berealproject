import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from 'mongoose';
import postRouter from './routes/postRoutes';
import authRouter from './routes/authRoutes';

import "./models/User";
import "./models/Post";
import "./models/Comment";
import userRouter from './routes/userRoutes';
import commentRouter from './routes/commentRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialDB'

app.use(express.json());

mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB')).catch((error) => {
    console.log('MongoDB connection error', error);
    process.exit(1);
})

app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!')
})

app.listen(port, () => {
    console.log(`Listening ${port}`);
})