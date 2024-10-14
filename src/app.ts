import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from 'mongoose';
import router from './routes/postRoutes';

import "./models/User";
import "./models/Post";
import "./models/Comments";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialDB'

app.use(express.json());

mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB')).catch((error) => {
    console.log('MongoDB connection error', error);
    process.exit(1);
})

app.use('/api/posts', router)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!')
})

app.listen(port, () => {
    console.log(`Listening ${port}`);
})