import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import redditRoutes from './routes/reddit.js';
import assistantRoutes from './routes/assistant.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`database connected successfully`))
.catch((err) => console.log(err));


// routes 

app.use('/api/reddit', redditRoutes);
app.use('/api/ai', assistantRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});