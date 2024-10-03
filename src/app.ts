import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialDB'

mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB')).catch((error) => {
    console.log('MongoDB connection error', error);
    process.exit(1);
})

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!')
})

app.listen(port, () => {
    console.log(`Listening ${port}`);
})